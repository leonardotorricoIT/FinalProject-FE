export type FieldType =
  | "title"
  | "year"
  | "description"
  | "posterUrl"
  | "genres"
  | "cast"
  | "tags"
  | "studio"
  | "director";

export type Step1Fields = {
  field: FieldType;
  type: string;
  placeholder: string;
};
export type Step2Fields = {
  field: Extract<FieldType, "genres" | "cast" | "tags" | "studio" | "director">;
  type: "list" | "text";
  placeholder: string;
};

export type MovieErrorsType = Partial<Record<FieldType, string>>;
export type MovieTouchedType = Partial<Record<FieldType, boolean>>;

export const fields: Step1Fields[] = [
  { field: "title", type: "text", placeholder: "e.g., Interstellar" },
  { field: "year", type: "number", placeholder: "2014" },
  {
    field: "posterUrl",
    type: "url",
    placeholder: "https://example.com/poster.jpg",
  },
  { field: "description", type: "textarea", placeholder: "Brief synopsis..." },
];

export const secondStepFields: Step2Fields[] = [
  {
    field: "cast",
    type: "list",
    placeholder: "e.g., Leonardo DiCaprio, Anne Hathaway",
  },
  { field: "genres", type: "list", placeholder: "e.g., Sci-Fi, Drama" },
  { field: "tags", type: "list", placeholder: "e.g., space, time, Nolan" },
  { field: "studio", type: "text", placeholder: "e.g., Marvel, Universal" },
  { field: "director", type: "text", placeholder: "e.g., Nolan, Oswi" },
];

export const step1Keys = ["title", "year", "posterUrl", "description"] as const;
export const step2Keys = [
  "cast",
  "genres",
  "tags",
  "studio",
  "director",
] as const;
