type StatCardProps = {
  value: number | string;
  label: string;
  className?: string;
};

export default function StatCard({
  value,
  label,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center px-6 py-4",
        "border border-primary rounded-xl shadow-sm",
        "text-center",
        className,
      ].join(" ")}
    >
      <span className="text-2xl font-bold text-primary">{value}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
