import MovieCard from "../../components/MovieCard";
import { useMovies } from "../../context/MoviesContext";
import { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import Dropdown from "../../components/Dropdown";
import type { Movie } from "../../domain/Movie";

function Home() {
  const { state } = useMovies();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [activeFilter, setActiveFilter] = useState<"none" | "query" | "genre">(
    "none"
  );

  function filterMoviesByQuery(movies: Movie[], query: string): Movie[] {
    const cleanedQuery = query.trim().toLowerCase();
    if (!cleanedQuery) return movies;
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(cleanedQuery)
    );
  }

  function filterMoviesByGenre(movies: Movie[], genre: string): Movie[] {
    const cleanedGenre = genre.trim().toLowerCase();
    if (!cleanedGenre) return movies;
    return movies.filter((movie) =>
      movie.genres.some((genre) => genre.toLowerCase().includes(cleanedGenre))
    );
  }

  const filtered = useMemo(() => {
    const cleanedQuery = query.trim();
    const cleanedGenre = genre.trim();
    if (activeFilter === "genre") {
      return filterMoviesByGenre(state.movies, cleanedGenre);
    } else if (activeFilter === "query") {
      return filterMoviesByQuery(state.movies, cleanedQuery);
    } else {
      return state.movies;
    }
  }, [state.movies, query, genre, activeFilter]);

  return (
    <>
      <main className="min-h-screen bg-primary-bg dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Movies
          </h1>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center">
            <SearchBar
              value={query}
              onChange={(value) => {
                setQuery(value);
                setActiveFilter("query");
              }}
              placeHolder="Search by title..."
            />
            <Dropdown
              value={genre}
              options={state.genres}
              onChange={(option) => {
                setGenre(option);
                setActiveFilter("genre");
              }}
              className="sm:justify-self-end sm:w-64"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600 p-8 text-center text-neutral-500 dark:text-neutral-400">
              No results{query ? ` for “${query}”` : ""}.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {filtered.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Home;
