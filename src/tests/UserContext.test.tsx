import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { UserProvider, useUser } from "../context/UserContext";
import { mockGuest } from "../Mocks/user.mock";
import type { User } from "../domain/User";

const mockDb = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../db/db", () => ({
  dbPromise: Promise.resolve(mockDb),
}));

function TestComponent() {
  const {
    user,
    login,
    logout,
    addToWatchlist,
    deleteFromWatchlist,
    addToWatched,
    loading,
  } = useUser();

  return (
    <div>
      <p data-testid="user-email">{user.email ?? "guest"}</p>
      <p data-testid="loading">{loading ? "true" : "false"}</p>
      <button onClick={() => login("test@test.com", "1234")}>login</button>
      <button onClick={() => logout()}>logout</button>
      <button onClick={() => addToWatchlist(1)}>watchlist</button>
      <button onClick={() => deleteFromWatchlist(1)}>delete-watchlist</button>
      <button onClick={() => addToWatched(2)}>watched</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <UserProvider>
      <TestComponent />
    </UserProvider>
  );
}

describe("UserContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.get.mockResolvedValue(null);
  });

  it("renders with default guest user", async () => {
    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    expect(screen.getByTestId("user-email").textContent).toBe(mockGuest.email);
  });

  it("login success updates user", async () => {
    const fakeUser: User = {
      email: "test@test.com",
      password: "1234",
      watchlist: [],
      watched: [],
      isLoggedIn: false,
      name: "",
      role: "user",
    };

    mockDb.get.mockImplementation(async (store: string, key: string) => {
      if (store === "users" && key === "test@test.com") return fakeUser;
      return null;
    });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    await act(async () => {
      screen.getByText("login").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("user-email").textContent).toBe("test@test.com")
    );

    expect(mockDb.put).toHaveBeenCalledWith(
      "users",
      expect.objectContaining({ isLoggedIn: true })
    );
  });

  it("logout resets to guest", async () => {
    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false")
    );

    await act(async () => {
      screen.getByText("logout").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("user-email").textContent).toBe(mockGuest.email)
    );

    expect(mockDb.delete).toHaveBeenCalledWith("session", "current");
  });

  it("addToWatchlist adds new movie", async () => {
    const fakeUser: User = {
      email: "test@test.com",
      password: "1234",
      watchlist: [],
      watched: [],
      isLoggedIn: true,
      name: "",
      role: "user",
    };

    mockDb.get.mockImplementation(async (store: string, key: string) => {
      if (store === "session" && key === "current") return "test@test.com";
      if (store === "users" && key === "test@test.com") return fakeUser;
      return null;
    });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-email").textContent).toBe("test@test.com")
    );

    await act(async () => {
      screen.getByText("watchlist").click();
    });

    await waitFor(() =>
      expect(mockDb.put).toHaveBeenCalledWith(
        "users",
        expect.objectContaining({ watchlist: [1] })
      )
    );
  });

  it("deleteFromWatchlist removes movie", async () => {
    const fakeUser: User = {
      email: "test@test.com",
      password: "1234",
      watchlist: [1],
      watched: [],
      isLoggedIn: true,
      name: "",
      role: "guest",
    };

    mockDb.get.mockImplementation(async (store: string, key: string) => {
      if (store === "session" && key === "current") return "test@test.com";
      if (store === "users" && key === "test@test.com") return fakeUser;
      return null;
    });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-email").textContent).toBe("test@test.com")
    );

    await act(async () => {
      screen.getByText("delete-watchlist").click();
    });

    await waitFor(() =>
      expect(mockDb.put).toHaveBeenCalledWith(
        "users",
        expect.objectContaining({ watchlist: [] })
      )
    );
  });

  it("addToWatched adds movie if not exists", async () => {
    const fakeUser: User = {
      email: "test@test.com",
      password: "1234",
      watchlist: [],
      watched: [],
      isLoggedIn: true,
      name: "",
      role: "guest",
    };

    mockDb.get.mockImplementation(async (store: string, key: string) => {
      if (store === "session" && key === "current") return "test@test.com";
      if (store === "users" && key === "test@test.com") return fakeUser;
      return null;
    });

    renderWithProvider();

    await waitFor(() =>
      expect(screen.getByTestId("user-email").textContent).toBe("test@test.com")
    );

    await act(async () => {
      screen.getByText("watched").click();
    });

    await waitFor(() =>
      expect(mockDb.put).toHaveBeenCalledWith(
        "users",
        expect.objectContaining({ watched: [2] })
      )
    );
  });
});
