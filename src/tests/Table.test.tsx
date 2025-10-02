import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Table } from "../components/Table";
import type { User } from "../domain/User";

describe("Table component", () => {
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
  ];

  const data: User[] = [
    {
      name: "John Perez",
      email: "john@gmail.com",
      password: "user",
      role: "user",
      isLoggedIn: true,
    },
    {
      name: "Juan Perez",
      email: "juan@gmail.com",
      password: "user",
      role: "user",
      isLoggedIn: true,
    },
  ];

  it("should render table headers", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("should render table rows", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("John Perez")).toBeInTheDocument();
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("john@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("juan@gmail.com")).toBeInTheDocument();
  });

  it("should render custom cell with render function", () => {
    const customColumns = [
      { key: "id", header: "ID" },
      { key: "name", header: "Name" },
      {
        key: "email",
        header: "Contact",
        render: (row: User) => <span>{row.email}</span>,
      },
    ];

    render(<Table data={data} columns={customColumns} />);

    expect(screen.getByText("john@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("juan@gmail.com")).toBeInTheDocument();
  });

  it("should render multiple rows correctly", () => {
    render(<Table data={data} columns={columns} />);

    const rows = screen.getAllByRole("row");

    expect(rows).toHaveLength(3);
  });
});
