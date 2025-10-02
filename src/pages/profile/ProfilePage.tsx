import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useMovies } from "../../context/MoviesContext";
import { i18n } from "../../i18n";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import StatCard from "../../components/ui/cards/StatCard";
import MyReviews from "../../components/review/MyReviews";
import Toast from "../../components/Toast";
import MovieCard from "../../components/ui/cards/MovieCard";

type ToastState = { message: string; type: "success" | "error" } | null;

function ProfilePage() {
  const navigate = useNavigate();
  const { user, deleteFromWatchlist } = useUser();
  const [toast, setToast] = useState<ToastState>(null);
  const { state } = useMovies();
  const [activeTab, setActiveTab] = useState<
    "reviews" | "watchlist" | "watched"
  >("reviews");

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name || "User"
  )}&background=random&rounded=true&size=128`;

  const watchedMovies = state.movies.filter((m) =>
    user.watched?.includes(m.id)
  );

  const watchlistMovies = state.movies.filter((m) =>
    user.watchlist?.includes(m.id)
  );
  const userReviews = state.reviews.filter((r) => r.userId === user.email);
  const moviesWatchedCount = watchedMovies.length;

  const avgRating =
    userReviews.length > 0
      ? (
          userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length
        ).toFixed(1)
      : "—";

  async function handleDelete(movieId: number) {
    const res = await deleteFromWatchlist(movieId);
    if (res) setToast({ message: "Removed from watchlist.", type: "success" });
    else
      setToast({
        message: "This movie was not in your watchlist",
        type: "error",
      });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <button
            onClick={() => navigate(-1)}
            className="flex mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white items-center justify-center cursor-pointer"
          >
            <FaArrowLeft className="text-primary mr-2" />
            {i18n.moviePage.back}
          </button>
          <img
            src={user.avatar || avatarUrl}
            alt="profile"
            className="w-24 h-24 rounded-full border border-gray-300"
          />

          <div>
            <h2 className="text-xl font-bold dark:text-blue-200">
              {user.name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <StatCard value={moviesWatchedCount} label="Movies Watched" />
          <StatCard value={avgRating} label="Avg. Rating" />
        </div>
      </div>

      <div className="mt-8 border-b flex gap-6 border-gray-300">
        <button
          className={`pb-2 ${
            activeTab === "reviews"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-primary"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          {i18n.profile.reviews}
        </button>
        <button
          className={`pb-2 ${
            activeTab === "watchlist"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-primary"
          }`}
          onClick={() => setActiveTab("watchlist")}
        >
          {i18n.navbar.WatchList}
        </button>
        <button
          className={`pb-2 ${
            activeTab === "watched"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 hover:text-primary"
          }`}
          onClick={() => setActiveTab("watched")}
        >
          {i18n.profile.watched}
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "reviews" && <MyReviews />}

        {activeTab === "watchlist" && (
          <>
            {watchlistMovies.length === 0 ? (
              <p className="text-gray-600">{i18n.profile.noContent}</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {watchlistMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    optionLabels={["Delete"]}
                    optionHandlers={[
                      () => {
                        handleDelete(movie.id);
                      },
                    ]}
                  />
                ))}
              </div>
            )}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                duration={3000}
                onClose={() => setToast(null)}
              />
            )}
          </>
        )}

        {activeTab === "watched" && (
          <>
            {watchedMovies.length === 0 ? (
              <p className="text-gray-600">{i18n.profile.noContent}</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {watchedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
