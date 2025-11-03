/* eslint-disable */
import { createContext, useContext, useEffect, useReducer } from "react";
import { dbPromise } from "../db/db";
import type { Movie } from "../domain/Movie";
import type { Review, ReviewWithMovie } from "../domain/Review";
import type { State } from "../domain/State";
import { moviesMock } from "../Mocks/movies.mock";
import { reviewsMock } from "../Mocks/reviews.mock";
import { computeGenres } from "./Helpers";
import { useUser } from "./UserContext";

type Action =
  | { type: "SET_DATA"; movies: Movie[]; reviews: Review[] }
  | { type: "ADD_MOVIE"; movie: Movie }
  | { type: "EDIT_MOVIE"; movie: Movie }
  | { type: "DELETE_MOVIE"; id: number }
  | { type: "ADD_REVIEW"; review: Review }
  | { type: "EDIT_REVIEW"; review: Review }
  | { type: "DELETE_REVIEW"; id: number };

const MoviesContext = createContext<{
  state: State;
  addMovie: (movie: Partial<Movie>) => Promise<void>;
  editMovie: (m: Movie) => Promise<void>;
  deleteMovie: (id: number) => Promise<void>;
  addReview: (r: Omit<Review, "id" | "createdAt">) => Promise<void>;
  editReview: (r: Review) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  getUserReviews: (userId: string) => ReviewWithMovie[];
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DATA": {
      const genres = computeGenres(action.movies);
      return { movies: action.movies, reviews: action.reviews, genres };
    }
    case "ADD_MOVIE": {
      const movies = [...state.movies, action.movie];
      const genres = computeGenres(movies);
      return { ...state, movies: [...state.movies, action.movie], genres };
    }
    case "EDIT_MOVIE": {
      const movies = state.movies.map((m) =>
        m.id === action.movie.id ? action.movie : m
      );
      const genres = computeGenres(movies);
      return { ...state, movies, genres };
    }
    case "DELETE_MOVIE": {
      const movies = state.movies.filter((movie) => movie.id !== action.id);
      const filteredReviews = state.reviews.filter(
        (review) => review.movieId !== action.id
      );
      const genres = computeGenres(movies);
      return { ...state, movies, reviews: filteredReviews, genres };
    }
    case "ADD_REVIEW":
      return { ...state, reviews: [...state.reviews, action.review] };
    case "EDIT_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.review.id ? action.review : r
        ),
      };
    case "DELETE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.filter((r) => r.id !== action.id),
      };
    default:
      return state;
  }
}

export function MoviesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    movies: [],
    reviews: [],
    genres: [],
  });
  const { addToWatched } = useUser();

  // cargar desde indexedDB
  useEffect(() => {
    (async () => {
      const db = await dbPromise;
      const reviewRows = await db.getAll("reviews");
      const alreadySeeded = localStorage.getItem("movies.seeded") === "1";
      if (!alreadySeeded) {
        const tx = db.transaction("movies", "readwrite");
        const store = tx.objectStore("movies");
        localStorage.setItem("movies.seeded", "1");
        await Promise.all(
          moviesMock.map(async (movie) => {
            const { id: _ignore, ...insertable } = movie;
            await store.add({
              ...insertable,
              createdAt: insertable.createdAt ?? new Date().toISOString(),
            });
          })
        );
        await tx.done;
      }

      if (reviewRows.length === 0) {
        const alreadySeeded = localStorage.getItem("reviews.seeded") === "1";
        if (!alreadySeeded) {
          const tx = db.transaction("reviews", "readwrite");
          const store = tx.objectStore("reviews");
          localStorage.setItem("reviews.seeded", "1");
          await Promise.all(
            reviewsMock.map(async (review) => {
              const { id: _ignore, ...insertable } = review;
              await store.add({
                ...insertable,
                createdAt: insertable.createdAt ?? new Date().toISOString(),
              });
            })
          );
          await tx.done;
        }
      }

      const freshMovies = await db.getAll("movies");
      const freshReviews = await db.getAll("reviews");

      const movies: Movie[] = freshMovies.map((movie) => ({
        id: movie.id!,
        ...movie,
      }));
      const reviews: Review[] = freshReviews.map((review) => ({
        id: review.id!,
        ...review,
      }));
      dispatch({ type: "SET_DATA", movies, reviews });
    })();
  }, []);

  // funciones
  const addMovie = async (movie: Partial<Movie>) => {
    const db = await dbPromise;
    const rightNowDate = new Date().toISOString();

    if (
      !movie.title ||
      !movie.year ||
      !movie.genres ||
      !movie.description ||
      !movie.posterUrl ||
      !movie.cast ||
      !movie.tags ||
      !movie.studio ||
      !movie.director
    ) {
      throw new Error("All required movie fields must be provided.");
    }

    const id = await db.add("movies", {
      title: movie.title,
      year: movie.year,
      genres: movie.genres,
      description: movie.description,
      posterUrl: movie.posterUrl,
      cast: movie.cast,
      tags: movie.tags,
      createdAt: rightNowDate,
      studio: movie.studio,
      director: movie.director,
    });
    const newMovie: Movie = {
      id,
      title: movie.title,
      year: movie.year,
      genres: movie.genres,
      description: movie.description,
      posterUrl: movie.posterUrl,
      cast: movie.cast,
      tags: movie.tags,
      createdAt: rightNowDate,
      studio: movie.studio,
      director: movie.director,
    };
    dispatch({ type: "ADD_MOVIE", movie: newMovie });
  };

  const editMovie = async (movie: Movie) => {
    const db = await dbPromise;
    await db.put("movies", movie);
    dispatch({ type: "EDIT_MOVIE", movie });
  };

  const deleteMovie = async (id: number) => {
    const db = await dbPromise;
    await db.delete("movies", id);

    const tx = db.transaction("reviews", "readwrite");
    const store = tx.objectStore("reviews");
    const reviews = (await store.getAll()) as Review[];
    const relatedReviews = reviews.filter((r) => r.movieId === id);

    await Promise.all(
      relatedReviews
        .filter((r) => typeof r.id === "number")
        .map((r) => store.delete(r.id as number))
    );

    await tx.done;
    dispatch({ type: "DELETE_MOVIE", id });
  };

  const getUserReviews = (userId: string): ReviewWithMovie[] => {
    return state.reviews
      .filter((r) => r.userId === userId)
      .map((r) => {
        const movie = state.movies.find((m) => m.id === r.movieId);
        return {
          ...r,
          movie: {
            id: movie?.id ?? 0,
            title: movie?.title ?? "Unknown",
            posterUrl: movie?.posterUrl ?? "/default-poster.png",
          },
        };
      });
  };

  const addReview = async (r: Omit<Review, "id" | "createdAt">) => {
    const db = await dbPromise;
    const rightNowDate = new Date().toISOString();
    const newReviewId = await db.put("reviews", {
      ...r,
      createdAt: rightNowDate,
    });

    const newReview: Review = {
      id: newReviewId,
      ...r,
      createdAt: rightNowDate,
    };
    dispatch({ type: "ADD_REVIEW", review: newReview });
    addToWatched(newReview.movieId);
  };

  const editReview = async (review: Review) => {
    const db = await dbPromise;
    await db.put("reviews", review);
    dispatch({ type: "EDIT_REVIEW", review });
  };

  const deleteReview = async (id: number) => {
    const db = await dbPromise;
    await db.delete("reviews", id);
    dispatch({ type: "DELETE_REVIEW", id });
  };

  return (
    <MoviesContext.Provider
      value={{
        state,
        addMovie,
        editMovie,
        deleteMovie,
        addReview,
        editReview,
        deleteReview,
        getUserReviews,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be inside MoviesProvider");
  return ctx;
}
