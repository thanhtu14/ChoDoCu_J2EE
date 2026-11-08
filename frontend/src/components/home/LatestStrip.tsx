import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { BaiDang } from "../../types";
import { formatPrice, timeAgo } from "../../utils/format";
import { imgSrc, onImgError } from "../../utils/image";
import MaterialIcon from "../common/MaterialIcon";
import FavoriteButton from "./FavoriteButton";

const FILTERS: { key: string; label: string; test: (p: BaiDang) => boolean }[] = [
  { key: "all", label: "Tất cả", test: () => true },
  { key: "cheap", label: "Dưới 1 triệu", test: (p) => p.giaTien < 1_000_000 },
  { key: "mid", label: "Từ 1 – 5 triệu", test: (p) => p.giaTien >= 1_000_000 && p.giaTien <= 5_000_000 },
  { key: "high", label: "Trên 5 triệu", test: (p) => p.giaTien > 5_000_000 },
];

/** Dải tin mới trượt ngang, có lọc nhanh theo mức giá. */
export default function LatestStrip({ posts }: { posts: BaiDang[] }) {
  const [filter, setFilter] = useState("all");
  const scroller = useRef<HTMLDivElement>(null);
  const items = posts.filter(FILTERS.find((f) => f.key === filter)!.test);
  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section aria-labelledby="latest-title">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div className="flex items-center gap-space-md">
          <div>
            <h2 id="latest-title" className="m-0 font-headline-2 text-headline-2 text-on-surface">Tin đăng mới &amp; Đồ cũ giá tốt</h2>
            <p className="m-0 mt-space-2xs font-caption text-caption text-on-surface-variant">Cập nhật liên tục từ người bán trên toàn quốc.</p>
          </div>
          <div className="hidden sm:flex gap-space-xs">
            {[-1, 1].map((d) => (
              <button key={d} type="button" onClick={() => scroll(d)} aria-label={d < 0 ? "Trước" : "Sau"} className="w-8 h-8 rounded-full border-0 cursor-pointer bg-surface-container-lowest shadow-sm hover:bg-surface-container-high flex items-center justify-center text-on-surface">
                <MaterialIcon name={d < 0 ? "chevron_left" : "chevron_right"} size={18} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-space-xs" role="group" aria-label="Lọc theo giá">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className={`rounded-full border-0 cursor-pointer px-space-md py-space-xs font-caption-bold text-caption-bold transition-colors ${filter === f.key ? "bg-on-surface text-white" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-space-lg font-body-2 text-body-2 text-on-surface-variant">Chưa có tin nào trong mức giá này.</p>
      ) : (
        <div ref={scroller} className="mt-space-lg flex gap-space-md overflow-x-auto pb-space-sm snap-x">
          {items.map((p) => (
            <article key={p.id} className="relative flex w-[320px] shrink-0 snap-start overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
              <Link to={`/bai-dang/${p.id}`} aria-label={p.tieuDe} className="block w-[130px] shrink-0 bg-surface-container">
                <img src={imgSrc(p.anhs[0])} alt="" loading="lazy" onError={onImgError} className="h-full w-full object-cover" />
              </Link>
              <FavoriteButton id={p.id} className="absolute right-space-sm top-space-sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-space-2xs p-space-md">
                <span className="font-headline-3 text-headline-3 font-bold text-primary-container">{formatPrice(p.giaTien)}</span>
                <h3 className="m-0 font-caption-bold text-caption-bold text-on-surface line-clamp-2">
                  <Link to={`/bai-dang/${p.id}`} className="text-inherit no-underline hover:text-primary">{p.tieuDe}</Link>
                </h3>
                <span className="mt-auto truncate font-caption text-caption text-on-surface-variant">{p.tenThanhPho} · {timeAgo(p.ngayDang)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
