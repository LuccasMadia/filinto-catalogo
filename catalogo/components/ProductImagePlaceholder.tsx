export function ProductImagePlaceholder() {
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-neutral-200">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-10 w-10 text-neutral-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10a4 4 0 1 1 8 0c1.5 0 2.5 1 2.5 2.3 0 1.2-.9 2.2-2.1 2.3L12 21l-4.4-6.4C6.4 14.5 5.5 13.5 5.5 12.3 5.5 11 6.5 10 8 10Z"
        />
      </svg>
    </div>
  );
}
