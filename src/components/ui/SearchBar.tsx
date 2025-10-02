import { useEffect, useMemo, useState } from "react";

type SearchBarPros = {
  value: string;
  onChange: (query: string) => void;
  placeHolder?: string;
  debounceMs?: number;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeHolder = "Search...",
  debounceMs = 20,
  className = "",
}: SearchBarPros) {
  const [query, setQuery] = useState(value);
  useEffect(() => setQuery(value), [value]);

  const debouncedChange = useMemo(() => {
    return (next: string) => {
      setTimeout(() => onChange(next), debounceMs);
    };
  }, [onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    debouncedChange(next);
  };

  const clear = () => {
    setQuery("");
    onChange("");
  };

  return (
    <div className={["relative", className].join(" ")}>
      <input
        type="input"
        value={query}
        onChange={handleChange}
        placeholder={placeHolder}
        aria-label="Search"
        className="w-full rounded-xl px-4 py-2 pr-10 outline-none border border-neutral-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 caret-neutral-800 dark:caret-neutral-100 focus:ring-2 focus:ring-sky-500"
      />
      {query && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}
