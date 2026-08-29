export function SparkleIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1.5 13.7 8.3 20.5 10 13.7 11.7 12 18.5 10.3 11.7 3.5 10 10.3 8.3 12 1.5Z" />
    </svg>
  );
}
