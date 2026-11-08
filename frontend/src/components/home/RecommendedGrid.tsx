import { useState } from "react";
import { baiDangApi } from "../../api/baiDang";
import { useFetch } from "../../hooks/useFetch";
import type { DanhMuc } from "../../types";
import { Empty, ErrorBox, Spinner } from "../common/State";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  return nums.flatMap((n, i) => (i > 0 && n - nums[i - 1] > 1 ? (["…", n] as const) : [n]));
}

/** Lưới "Gợi ý dành riêng cho bạn": lọc theo danh mục gốc, phân trang 12 tin/trang. */
export default function RecommendedGrid({ categories }: { categories: DanhMuc[] }) {
  const [cat, setCat] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => baiDangApi.tim({ idDanhMuc: cat, page, pageSize: PAGE_SIZE }), [cat, page]);

  const pick = (id?: number) => {
    setCat(id);
    setPage(1);
  };
  const chip = (active: boolean) =>
    `rounded-full border-0 cursor-pointer px-space-md py-space-xs font-caption-bold text-caption-bold transition-colors ${active ? "bg-primary-container text-white" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"}`;

  const from = data && data.totalCount > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const to = data ? from + data.items.length - (data.items.length ? 1 : 0) : 0;

  return (
    <section aria-labelledby="rec-title">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <h2 id="rec-title" className="m-0 font-headline-2 text-headline-2 text-on-surface">Gợi ý dành riêng cho bạn</h2>
          <p className="m-0 mt-space-2xs font-caption text-caption text-on-surface-variant">Sản phẩm đồ cũ giá tốt nhất, tuyển chọn kỹ và người bán phản hồi nhanh.</p>
        </div>
        <div className="flex flex-wrap gap-space-xs" role="group" aria-label="Lọc theo danh mục">
          <button type="button" className={chip(cat === undefined)} aria-pressed={cat === undefined} onClick={() => pick(undefined)}>Tất cả</button>
          {categories.slice(0, 5).map((c) => (
            <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => pick(c.id)}>{c.tenDanhMuc}</button>
          ))}
        </div>
      </div>

      <div className="mt-space-lg">
        {loading && !data && <Spinner />}
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && data.items.length === 0 && <Empty title="Chưa có tin nào phù hợp" />}
        {data && data.items.length > 0 && (
          <div className={`grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {data.items.map((p) => <ProductCard key={p.id} post={p} />)}
          </div>
        )}
      </div>

      {data && data.totalCount > 0 && (
        <div className="mt-space-xl flex flex-wrap items-center justify-between gap-space-md">
          <span className="font-caption text-caption text-on-surface-variant">Hiển thị {from} - {to} trên {data.totalCount} sản phẩm</span>
          {data.totalPages > 1 && (
            <nav aria-label="Phân trang" className="flex items-center gap-space-xs">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="h-9 px-space-md rounded-lg border-0 cursor-pointer bg-surface-container-lowest font-caption text-caption text-on-surface disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
              {pageList(page, data.totalPages).map((n, i) =>
                n === "…" ? (
                  <span key={`g${i}`} className="px-space-xs text-on-surface-variant">…</span>
                ) : (
                  <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => setPage(n)} className={`h-9 min-w-9 rounded-lg border-0 cursor-pointer font-caption-bold text-caption-bold ${n === page ? "bg-primary-container text-white" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"}`}>{n}</button>
                ),
              )}
              <button type="button" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} className="h-9 px-space-md rounded-lg border-0 cursor-pointer bg-surface-container-lowest font-caption text-caption text-on-surface disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
