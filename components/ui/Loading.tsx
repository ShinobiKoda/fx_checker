type Props = {
  size?: number;
  text?: string;
  className?: string;
};

export default function Loading({
  size = 48,
  text = "FX CHECKER",
  className = "",
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-neutral-900 min-h-screen flex items-center justify-center text-neutral-500 ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin text-neutral-400"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm text-neutral-500">{text}</span>
      </div>
    </div>
  );
}
