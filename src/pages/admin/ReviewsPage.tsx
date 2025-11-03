/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import Stars from "../../components/Stars";
import { Table } from "../../components/Table";
import { dbPromise } from "../../db/db";
import { useMovies } from "../../context/MoviesContext";
import type { User } from "../../domain/User";
import SearchBar from "../../components/SearchBar";
import type { Review } from "../../domain/Review";

function ReviewsPage() {
  const { state } = useMovies();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const db = await dbPromise;
      const allUsers = await db.getAll("users");
      setUsers(allUsers);
    })();
  }, []);

  function reviewsParser(
    reviews: Review[]
  ): { user: string; movie: string; rating: number; text: string }[] {
    const filteredReviews = reviews.map((review) => {
      const movie = state.movies.find((m) => m.id === review.movieId);
      const user = users.find((u) => u.email === review.userId);

      return {
        user: user?.name ?? "Unknown",
        movie: movie?.title ?? "Unknown",
        rating: review.rating,
        text: review.text ?? "",
      };
    });
    return filteredReviews;
  }

  function filterReviewsByQuery(
    revies: Review[],
    query: string
  ): { user: string; movie: string; rating: number; text: string }[] {
    const parsedReviews = reviewsParser(revies);
    if (query === "") return parsedReviews;
    return parsedReviews.filter(
      (review) =>
        review.user.toLowerCase().includes(query.toLowerCase()) ||
        review.movie.toLowerCase().includes(query.toLowerCase())
    );
  }

  const filteredReviews = useMemo(() => {
    const cleanedQuery = query.trim().toLowerCase();
    return filterReviewsByQuery(state.reviews, cleanedQuery);
  }, [state.reviews, query, users]);

  return (
    <div>
      <main className="min-h-screen bg-primary-bg dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Reviews
          </h1>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-center ">
            <SearchBar
              value={query}
              onChange={(value) => {
                setQuery(value);
              }}
              placeHolder="Search by user or movie title..."
            />
          </div>

          <div className="min-h-screen bg-primary-bg py-10 dark:bg-gray-800">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-500 text-center">No results</p>
            ) : (
              <Table
                data={filteredReviews}
                columns={[
                  { key: "user", header: "User" },
                  { key: "movie", header: "Movie" },
                  {
                    key: "rating",
                    header: "Rating",
                    render: (row) => (
                      <div className="flex justify-center">
                        <Stars rating={row.rating} />
                      </div>
                    ),
                  },
                  { key: "text", header: "Message" },
                ]}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReviewsPage;
