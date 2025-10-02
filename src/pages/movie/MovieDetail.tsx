import { useNavigate, useParams } from "react-router";
import { useMovies } from "../../context/MoviesContext";
import { FaArrowLeft } from "react-icons/fa";
import RatingBadge from "../../components/RatingBadge";
import { i18n } from "../../i18n";
import { useUser } from "../../context/UserContext";
import Toast from "../../components/ui/Toast";
import { useState } from "react";
import ReviewComponent from "../../components/review/ReviewComponent";
import AddEditReviewForm from "../../components/review/AddEditReviewForm";
import { useMovieReviews } from "./hooks/useMovieReviews";
import CastCard from "../../components/ui/cards/CastCard";
import type { Review } from "../../domain/Review";

function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);
  const { state } = useMovies();
  const { user, addToWatchlist, addToWatched } = useUser();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { myReview, otherReviews, addMyReview } = useMovieReviews(movieId);

  const movie = state.movies.find((m) => m.id === movieId);

  const movieReviews = state.reviews.filter((r) => r.movieId === movieId);
  const avgRating =
    movieReviews.length > 0
      ? movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length
      : 0;
  const isInWatched = user?.watched?.includes(movieId);
  const isInWatchlist = user?.watchlist?.includes(movieId);


  const handleSubmitReview = async (
    reviewData: Omit<Review, "id" | "createdAt">
  ) => {
    await addMyReview(reviewData);

    setToast({
      message: i18n.moviePage.postedReview,
      type: "success",
    });
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-primary-bg dark:bg-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          {i18n.moviePage.movieNotFound}
        </p>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-primary-bg dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white items-center justify-center cursor-pointer"
          >
            <FaArrowLeft className="text-primary mr-2" />
            {i18n.moviePage.back}
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-lg shadow-md"
              />

              {user.isLoggedIn && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={async () => {
                      const result = await addToWatched(movieId);
                      setToast({
                        message:
                          result === "added"
                            ? i18n.moviePage.addedToWatched
                            : i18n.moviePage.alredyInWatched,
                        type: result === "added" ? "success" : "error",
                      });
                    }}
                    disabled={isInWatched}
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${
                      isInWatched
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "text-white bg-secundary dark:bg-gray-700 dark:text-gray-200 hover:brightness-110 dark:hover:bg-gray-600"
                    }`}
                  >
                    {isInWatched
                      ? i18n.moviePage.alredyInWatched
                      : i18n.moviePage.watched}
                  </button>

                  <button
                    onClick={async () => {
                      const result = await addToWatchlist(movieId);
                      setToast({
                        message:
                          result === "added"
                            ? i18n.moviePage.addedToWatchlist
                            : i18n.moviePage.alredyInWatchlist,
                        type: result === "added" ? "success" : "error",
                      });
                    }}
                    disabled={isInWatchlist}
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${
                      isInWatchlist
                        ? "bg-gray-400 cursor-not-allowed text-gray-200"
                        : "text-white bg-primary dark:bg-gray-700 dark:text-gray-200 hover:brightness-110 dark:hover:bg-gray-600"
                    }`}
                  >
                    {isInWatchlist
                      ? i18n.moviePage.alredyInWatchlist
                      : i18n.moviePage.watchlist}
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {movie.title}
                  </h1>
                  <p className="text-lg text-gray-500">
                    {movie.year} •{" "}
                    {movie.genres.map((genre, index) => (
                      <span key={index}>
                        {genre}
                        {index < movie.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>

                <RatingBadge rating={avgRating} />

              </div>

              <p className="font-semibold dark:text-white">
                {i18n.moviePage.description}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-10">
                {movie.description}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold dark:text-white">
                    {i18n.moviePage.director}
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {movie.director ? movie.director : "Director name"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white">
                    {i18n.moviePage.studio}
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {movie.studio ? movie.studio : "Studio name"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white mb-4">
                  {i18n.moviePage.cast}
                </h3>
                <div>
                  {movie.cast && movie.cast.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {movie.cast.map((actor, index) => (
                        <CastCard key={index} name={actor} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      {i18n.moviePage.noCastAvailable}
                    </p>
                  )}
                </div>
              </div>
              {user.isLoggedIn && (
                <section className="pt-6 mt-6">
                  <h4 className="text-gray-500 dark:text-gray-300 text-sm font-semibold">
                    Your review
                  </h4>
                  {myReview && user.isLoggedIn ? (
                    <ReviewComponent
                      review={myReview}
                      readonly={true}
                      bgColor="#e4f7ff"
                    />
                  ) : (
                    <AddEditReviewForm
                      movieId={movieId}
                      onSubmit={handleSubmitReview}
                    />
                  )}
                </section>
              )}
              <section className="py-4">
                <h2 className="dark:text-gray-300 font-semibold text-lg pb-2">
                  {i18n.moviePage.reviews}
                </h2>
                {otherReviews.length === 0 ? (
                  <p className="text-gray-400 text-center">
                    {i18n.moviePage.noReviews}
                  </p>
                ) : (
                  otherReviews.map((review) => (
                    <ReviewComponent
                      readonly={true}
                      key={review.id}
                      review={review}
                    />
                  ))
                )}
              </section>
            </div>
          </div>
        </div>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </>
  );
}

export default MovieDetail;
