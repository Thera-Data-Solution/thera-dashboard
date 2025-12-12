interface Pagination {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pager({ page, totalPages, onPageChange }: Pagination) {
  return (
    <div className="flex justify-center my-8">
      <div className="inline-flex items-center gap-2">

        {/* PREV */}
        <button
          onClick={() => page > 1 && onPageChange(page - 1)}
          disabled={page <= 1}
          className={`px-4 py-2 border rounded-md text-sm
            ${page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
          `}
        >
          Prev
        </button>

        {/* CURRENT PAGE */}
        <span className="px-4 py-2 border rounded-md bg-gray-100 text-sm font-medium">
          {page} / {totalPages}
        </span>

        {/* NEXT */}
        <button
          onClick={() => page < totalPages && onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={`px-4 py-2 border rounded-md text-sm
            ${page >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
