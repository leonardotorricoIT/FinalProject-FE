/* eslint-disable */
import { MdEdit, MdDelete } from "react-icons/md";
import { Table } from "../../components/Table";
import { useState, lazy, Suspense, useMemo } from "react";
import type { Movie } from "../../domain/Movie";
import { useMovies } from "../../context/MoviesContext";
import LoadingModal from "../../components/LoadingModalFallback";
import { makeEmptyMovieDraft } from "../../components/AddEditMovieModal/movieFormHelpers";
import SearchBar from "../../components/SearchBar";

const MovieFormWizard = lazy(
  () => import("../../components/MovieWizardModal/MovieFormWizard")
);

const ConfirmModal = lazy(() => import("../../components/ConfirmModal"));
const Toast = lazy(() => import("../../components/Toast"));

type WizardMode = "create" | "edit";

function Dashboard() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<WizardMode>("create");
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { state, addMovie, deleteMovie, editMovie } = useMovies();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState("");

  const handleOpenConfirm = (id: number) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
  };
  console.log(showToast);
  console.log(messageToast);
  console.log(Toast);
  const handleDelete = async () => {
    console.log("Delete movie with id:", selectedId);
    if (selectedId != null) {
      await deleteMovie(selectedId);
    }
    setIsDeleteModalOpen(false);
    setSelectedId(null);
    setMessageToast("Movie deleted successfully");
    setShowToast(true);
  };

  function filterMoviesByName(movies: Movie[]) {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.trim().toLowerCase())
    );
  }

  const filteredMovies = useMemo(() => {
    return filterMoviesByName(state.movies);
  }, [query, state.movies]);

  return (
    <>
      <div>
        <div className="min-h-screen bg-primary-bg dark:bg-gray-800 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="font-bold text-3xl  text-gray-800 dark:text-gray-100 mb-2">
            Movie Management
          </h2>
          <div className="md:flex items-center justify-between mb-6">
            <div className="mt-4 md:mt-0 md:flex-1 flex items-center gap-3">
              <SearchBar
                value={query}
                onChange={(value) => setQuery(value)}
                placeHolder="Search by title..."
              />
              <button
                onClick={() => {
                  setWizardMode("create");
                  setIsWizardOpen(true);
                }}
                className="btn-primary ml-auto"
                aria-label="Add new movie"
              >
                Add New Movie
              </button>
            </div>
          </div>

          <div>
            <Table<Movie>
              data={filteredMovies}
              columns={[
                { key: "title", header: "Movie" },
                { key: "year", header: "Year" },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setWizardMode("edit");
                          setIsWizardOpen(true);
                          setSelectedId(row.id);
                        }}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label={`Edit ${row.title}`}
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleOpenConfirm(row.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        aria-label={`Delete ${row.title}`}
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ),
                },
              ]}
            />

            {isDeleteModalOpen && (
              <Suspense
                fallback={
                  <LoadingModal label="Opening Confirm Delete Modal..." />
                }
              >
                <ConfirmModal
                  isOpen={isDeleteModalOpen}
                  title="Delete movie"
                  message="Are you sure to delete this movie? This action can't be undone."
                  confirmText="Delete"
                  cancelText="Cancel"
                  onConfirm={handleDelete}
                  onCancel={() => setIsDeleteModalOpen(false)}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {isWizardOpen && (
        <Suspense
          fallback={<LoadingModal label="Opening Edit Modie Modal..." />}
        >
          <MovieFormWizard
            open={isWizardOpen}
            initial={
              wizardMode === "edit"
                ? state.movies.find((movie) => movie.id === selectedId)
                : makeEmptyMovieDraft()
            }
            editable={wizardMode === "edit"}
            onClose={closeWizard}
            onEdit={async (input) => {
              await editMovie(input);
              closeWizard();
            }}
            onSubmit={async (draft) => {
              await addMovie(draft as Movie);
              closeWizard();
            }}
          />
        </Suspense>
      )}
    </>
  );
}

export default Dashboard;
