import { Route } from "@/routes/app.setting.user.index"

export default function Pagination({
    page,
    totalPages,
}: {
    page: number;
    totalPages: number;
}) {
    const navigate = Route.useNavigate();

    const go = (p: number) =>
        navigate({
            search: (prev) => ({
                ...prev,
                page: p,
            }),
        });

    const pagesToShow = getPagination(page, totalPages);

    return (
        <div className="flex items-center gap-2 py-4 justify-center">

            {/* Prev */}
            <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => go(page - 1)}
            >
                Prev
            </button>

            {/* Numbered pages */}
            {pagesToShow.map((p, i) =>
                p === "..." ? (
                    <span key={i} className="px-3">...</span>
                ) : (
                    <button
                        key={i}
                        onClick={() => go(Number(p))}
                        className={`px-3 py-1 border rounded ${page === p ? "bg-black text-white" : ""
                            }`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                className="px-3 py-1 border rounded disabled:opacity-40"
                disabled={page >= totalPages}
                onClick={() => go(page + 1)}
            >
                Next
            </button>
        </div>
    );
}

/**
 * Utility untuk membangkitkan:
 * 1 2 3 ... 10
 * atau:
 * 1 ... 4 5 6 ... 10
 * atau:
 * 1 2 3 4 5
 */
function getPagination(current: number, total: number) {
    const maxVisible = 7; // max tombol tampil

    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    pages.push(1);

    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
        pages.push(i);
    }

    if (right < total - 1) pages.push("...");

    pages.push(total);

    return pages;
}
