import type { ValidationError } from "yup";
import type { Movie } from "../../domain/Movie";
import type { FieldType, MovieErrorsType } from "./movieFormFields";

export type MovieDraft = Partial<Movie>;

export function makeEmptyMovieDraft(): MovieDraft {
  const now = new Date();
  return {
    id: 0,
    title: "",
    year: now.getFullYear(),
    description: "",
    posterUrl: "",
    genres: [],
    cast: [],
    tags: [],
    director: "",
    studio: "",
    createdAt: now.toISOString(),
  };
}

export function toMovie(draft: MovieDraft): Movie {
  const now = new Date();
  const movie: Movie = {
    ...draft,
    id: draft.id ?? 0,
    title: draft.title ?? "",
    year: draft.year ?? now.getFullYear(),
    description: draft.description ?? "",
    posterUrl: draft.posterUrl ?? "",
    genres: draft.genres ?? [],
    cast: draft.cast ?? [],
    tags: draft.tags ?? [],
    createdAt: draft.createdAt ?? now.toISOString(),
    director: draft.director ?? "",
    studio: draft.studio ?? "",
  };
  return movie;
}

export const mapYupToMovieErrors = (
  error: ValidationError
): MovieErrorsType => {
  const nextErrors: MovieErrorsType = {};
  for (const element of error.inner) {
    const key = element.path as FieldType;
    if (!key) continue;
    if (!nextErrors[key]) nextErrors[key] = element.message;
  }
  return nextErrors;
};

export function buildTouched(
  fields: readonly FieldType[]
): Record<FieldType, boolean> {
  const touchedByField: Record<FieldType, boolean> = {} as Record<
    FieldType,
    boolean
  >;
  for (const fieldName of fields) {
    touchedByField[fieldName] = true;
  }
  return touchedByField;
}
