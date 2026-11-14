import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { BaiDang } from "../../types";
import { formatPrice, timeAgo } from "../../utils/format";
import { imgSrc, onImgError } from "../../utils/image";
import MaterialIcon from "../common/MaterialIcon";
import FavoriteButton from "./FavoriteButton";

const AUTO_SPEED = 50;

function BoostedCard({ post }: { post: BaiDang }) {
  return (
    <article className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffb55e] via-primary-container to-[#e5610a] p-[2px] shadow-[0_10px_30px_-12px_rgba(255,122,0,0.7)] transition-transform duration-300 hover:-translate-y-1 sm:w-[340px]">
      <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-surface-container-lowest">
        <Link
          to={`/bai-dang/${post.id}`}
          aria-label={post.tieuDe}
          className="relative block aspect-[16/10] overflow-hidden bg-surface-container"
        >
          <img
            src={imgSrc(post.anhs[0])}
            alt=""
            loading="lazy"
            onError={onImgError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute left-space-sm top-space-sm inline-flex items-center gap-space-2xs rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff3d00] px-space-md py-space-2xs font-caption-bold text-caption-bold text-white shadow-md">
            <MaterialIcon
              name="rocket_launch"
              size={14}
              filled
            />{" "}
            Đẩy tin
          </span>
          <span className="absolute bottom-space-sm left-space-sm font-caption text-caption text-white/95">
            {post.tenDanhMuc}
          </span>
        </Link>
        <FavoriteButton
          id={post.id}
          className="absolute right-space-md top-space-md shadow-sm"
        />
        <div className="flex flex-1 flex-col gap-space-xs p-space-md">
          <span className="font-headline-2 text-headline-2 font-bold text-primary-container">
            {formatPrice(post.giaTien)}
          </span>
          <h3 className="m-0 font-body-1 text-body-1 font-semibold text-on-surface line-clamp-2">
            <Link
              to={`/bai-dang/${post.id}`}
              className="text-inherit no-underline hover:text-primary"
            >
              {post.tieuDe}
            </Link>
          </h3>
          <div className="mt-auto flex items-center justify-between gap-space-sm pt-space-xs font-caption text-caption text-on-surface-variant">
            <span className="inline-flex min-w-0 items-center gap-space-2xs">
              <MaterialIcon
                name="location_on"
                size={14}
                className="shrink-0 text-primary-container"
              />
              <span className="truncate">{post.tenThanhPho}</span>
            </span>
            <span className="shrink-0">{timeAgo(post.ngayDang)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Dải tin được đẩy: thẻ nổi bật viền gradient, tự cuộn từng thẻ, dừng khi rê chuột/focus hoặc bấm tạm dừng. */
export default function BoostedStrip({ posts }: { posts: BaiDang[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);
  const previousFrame = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = (card?.offsetWidth ?? 320) + 16;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 4)
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el || paused || hover || reduced || posts.length < 2) return;

    const tick = (now: number) => {
      if (previousFrame.current !== null) {
        const elapsed = Math.min(now - previousFrame.current, 50);
        // Move the native scroll position steadily to the left.
        el.scrollLeft += (AUTO_SPEED * elapsed) / 1000;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      previousFrame.current = now;
      animationFrame.current = window.requestAnimationFrame(tick);
    };

    previousFrame.current = null;
    animationFrame.current = window.requestAnimationFrame(tick);
    return () => {
      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = null;
      previousFrame.current = null;
    };
  }, [paused, hover, reduced, posts.length]);

  const round =
    "w-9 h-9 rounded-full border-0 cursor-pointer bg-surface-container-lowest shadow-sm hover:bg-primary-fixed flex items-center justify-center text-on-surface transition-colors";

  return (
    <section
      aria-labelledby="boost-title"
      className="rounded-3xl bg-gradient-to-br from-primary-fixed/70 via-surface-container-lowest to-surface-container-lowest p-space-lg sm:p-space-xl"
    >
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <div>
          <h2
            id="boost-title"
            className="m-0 flex items-center gap-space-xs font-headline-2 text-headline-2 text-on-surface"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#ff3d00] text-white flex items-center justify-center shadow-md">
              <MaterialIcon
                name="rocket_launch"
                size={20}
                filled
              />
            </span>
            Tin đăng mới &amp; Đồ cũ giá tốt
          </h2>
          <p className="m-0 mt-space-2xs font-caption text-caption text-on-surface-variant">
            Tin đang được đẩy, ưu tiên hiển thị đầu trang.
          </p>
        </div>
        <div className="flex gap-space-xs">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Tin trước"
            className={round}
          >
            <MaterialIcon
              name="chevron_left"
              size={20}
            />
          </button>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Bật tự cuộn" : "Tạm dừng tự cuộn"}
              className={round}
            >
              <MaterialIcon
                name={paused ? "play_arrow" : "pause"}
                size={18}
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Tin sau"
            className={round}
          >
            <MaterialIcon
              name="chevron_right"
              size={20}
            />
          </button>
        </div>
      </div>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setHover(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setHover(false);
          }
        }}
        className="mt-space-lg overflow-hidden"
      >
        <div
          ref={scroller}
          className="flex gap-space-md overflow-x-auto pb-space-md pt-space-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((p) => (
            <BoostedCard
              key={p.id}
              post={p}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
