/* eslint-disable */
import { createContext, useContext, useEffect, useState } from "react";
import { dbPromise } from "../db/db";
import type { User } from "../domain/User";
import { mockGuest as defaultGuest } from "../Mocks/user.mock";

interface UserContextType {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addToWatchlist: (movieId: number) => Promise<"added" | "exists">;
  addToWatched: (movieId: number) => Promise<"added" | "exists">;
  deleteFromWatchlist: (movieId: number) => Promise<boolean>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultGuest);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const db = await dbPromise;
      const session = await db.get("session", "current");
      if (session) {
        const savedUser = await db.get("users", session);
        setUser(savedUser ?? defaultGuest);
      } else {
        setUser(defaultGuest);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const db = await dbPromise;
    const existingUser = await db.get("users", email);

    if (!existingUser) {
      throw new Error("User not found");
    }
    if (existingUser.password !== password) {
      throw new Error("Invalid password");
    }

    const loggedUser: User = { ...existingUser, isLoggedIn: true };

    await db.put("users", loggedUser);
    await db.put("session", email, "current");
    setUser(loggedUser);
  };

  const logout = async () => {
    const db = await dbPromise;
    await db.delete("session", "current");
    setUser(defaultGuest);
  };

  const addToWatchlist = async (
    movieId: number
  ): Promise<"added" | "exists"> => {
    if (!user || !user.email) return "exists";

    const db = await dbPromise;
    const freshUser = await db.get("users", user.email);
    if (!freshUser) return "exists";

    if (freshUser.watchlist?.includes(movieId)) {
      return "exists";
    }

    const updatedUser = {
      ...freshUser,
      watchlist: [...(freshUser.watchlist ?? []), movieId],
    };

    await db.put("users", updatedUser);
    setUser(updatedUser);

    return "added";
  };

  const deleteFromWatchlist = async (movieId: number): Promise<boolean> => {
    if (!user || !user.email) return false;
    const db = await dbPromise;
    const targetUser = await db.get("users", user.email);
    if (!targetUser) return false;
    const updatedUser = {
      ...targetUser,
      watchlist:
        targetUser.watchlist?.filter((movie) => movie != movieId) ?? [],
    };
    await db.put("users", updatedUser);
    setUser(updatedUser);
    return true;
  };

  const addToWatched = async (movieId: number): Promise<"added" | "exists"> => {
    if (!user || !user.email) return "exists";

    const db = await dbPromise;
    const freshUser = await db.get("users", user.email);
    if (!freshUser) return "exists";

    if (freshUser.watched?.includes(movieId)) {
      return "exists";
    }

    const updatedUser = {
      ...freshUser,
      watched: [...(freshUser.watched ?? []), movieId],
    };

    await db.put("users", updatedUser);
    setUser(updatedUser);

    return "added";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        addToWatchlist,
        addToWatched,
        deleteFromWatchlist,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
