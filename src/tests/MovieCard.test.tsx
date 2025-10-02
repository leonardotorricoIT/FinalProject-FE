import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../domain/Movie";

const renderWithRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("MovieCard", () => {
  const baseMovie: Movie = {
    id: 123,
    title: "Inception",
    year: 2010,
    description: "A mind-bender.",
    posterUrl: "https://example.com/inception.jpg",
    genres: ["Sci-Fi"],
    cast: ["Leonardo DiCaprio"],
    tags: [],
    createdAt: new Date().toISOString(),
    director: "Christopher Nolan",
    studio: "Warner Bros",
  };

  it("renders title, year, and poster image", () => {
    renderWithRouter(<MovieCard movie={baseMovie} />);

    expect(
      screen.getByRole("heading", { name: /inception/i })
    ).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    const img = screen.getByAltText(/inception poster/i) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://example.com/inception.jpg");
  });

  it("shows fallbacks when title or poster are missing", () => {
    const movieMissing: Movie = {
      ...baseMovie,
      title: "",
      posterUrl: "",
    };

    renderWithRouter(<MovieCard movie={movieMissing} />);

    expect(
      screen.getByRole("heading", { name: /untitled/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/no image/i)).toBeInTheDocument();
  });

  it("links to the movie details and merges className", () => {
    renderWithRouter(<MovieCard movie={baseMovie} className="custom-card" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/123");

    const article = screen.getByRole("article");
    expect(article.className).toMatch(/custom-card/);
  });
});
