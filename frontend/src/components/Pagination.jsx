const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) {
    return null;
  }

  const visiblePages = Array.from({ length: pages }, (_, index) => index + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5
  );

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            pageNumber === page ? 'bg-ink text-paper' : 'border border-black/10 bg-white/80 text-ink hover:bg-black/5'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;