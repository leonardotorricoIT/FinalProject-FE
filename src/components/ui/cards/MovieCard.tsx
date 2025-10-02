import { Link } from "react-router";
import KebabMenu from "../../KebabMenu";
import type { Movie } from "../../../domain/Movie";


type MovieCardProps = {
  movie: Movie;
  className?: string;
  type?: string;
  optionLabels?: string[];
  optionHandlers?: Array<() => void>;
};

export default function MovieCard({
  movie,
  className = "",
  optionLabels,
  optionHandlers,
}: MovieCardProps) {
  const { id, title, year, posterUrl } = movie;
  const safeTitle = title || "Untitled";
  const safeYear = Number.isFinite(year) ? String(year) : "—";
  const hasOptions =
  Array.isArray(optionLabels) &&
  Array.isArray(optionHandlers) &&
  optionLabels.length > 0 &&
  optionLabels.length === optionHandlers.length;


  return (
    <Link to={`/movies/${id}`} className="block">
      <article
        className={[
          "flex flex-col rounded-2xl bg-white dark:bg-neutral-800",
          "border border-neutral-200/60 dark:border-neutral-700/60",
          "shadow-sm hover:shadow-md transition",
          className,
        ].join(" ")}
      >
        <div className="relative m-2 mb-0 overflow-hidden rounded-2xl aspect-[2/3] bg-neutral-100 dark:bg-neutral-700">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${safeTitle} poster`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-neutral-400">
              No image
            </div>
          )}
          {hasOptions && (
            <div className="absolute right-2 top-2 z-10">
              <KebabMenu
                optionLabels={optionLabels}
                optionHandlers={optionHandlers}
                insideLink
              />
            </div>
          )}
        </div>

        <div className="p-3 pb-4">
          <h3 className="truncate line-clamp-2 font-semibold text-neutral-900 dark:text-neutral-100">
            {safeTitle}
          </h3>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {safeYear}
          </p>
        </div>
      </article>
    </Link>
  );
}
