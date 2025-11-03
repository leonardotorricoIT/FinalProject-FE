type DropdownProps = {
  value: string;
  options: string[];
  onChange: (option: string) => void;
  className?: string;
};

export default function Dropdown({
  value,
  options,
  onChange,
  className = "",
}: DropdownProps) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <label className="sr-only">Filter</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full max-w-full min-w-0 rounded-xl px-3 pr-9 py-3 sm:py-2.5 text-[16px] sm:text-sm md:text-base border border-neutral-300 dark:border-neutral-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 appearance-none [background-image:none] outline-none focus:ring-2 focus:ring-sky-500 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-neutral-500 dark:text-neutral-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
