import { Link } from "react-router-dom";
import type { BaiDang } from "../../types";
import { formatPrice, timeAgo } from "../../utils/format";
import { imgSrc, onImgError } from "../../utils/image";
import MaterialIcon from "../common/MaterialIcon";
import FavoriteButton from "./FavoriteButton";

/** Thẻ sản phẩm dạng lưới; tin 0đ được nhấn mạnh bằng viền xanh ("Tặng lại"). */
export default function ProductCard({ post }: { post: BaiDang }) {
  const free = post.giaTien === 0;
  return (
    <article className={`relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md ${free ? "ring-2 ring-secondary-fixed-dim" : ""}`}>
      <Link to={`/bai-dang/${post.id}`} aria-label={post.tieuDe} className="relative block aspect-[4/3] overflow-hidden bg-surface-container">
        <img src={imgSrc(post.anhs[0])} alt="" loading="lazy" onError={onImgError} className="h-full w-full object-cover" />
        <span className={`absolute left-space-sm top-space-sm rounded-md px-space-sm py-space-2xs font-caption-bold text-caption-bold ${free ? "bg-secondary text-white" : "bg-primary-container text-white"}`}>
          {free ? "Tặng lại" : post.tenDanhMuc}
        </span>
        <span className="absolute left-space-sm bottom-space-sm inline-flex items-center gap-space-2xs rounded-md bg-white/90 px-space-xs py-space-2xs font-caption text-caption text-on-surface">
          <MaterialIcon name="photo_camera" size={12} /> {post.anhs.length} ảnh
        </span>
      </Link>
      <FavoriteButton id={post.id} className="absolute right-space-sm top-space-sm shadow-sm" />
      <div className="flex flex-1 flex-col gap-space-xs p-space-md">
        <span className={`font-headline-3 text-headline-3 font-bold ${free ? "text-secondary" : "text-primary-container"}`}>
          {free ? "0 đ (Tặng lại)" : formatPrice(post.giaTien)}
        </span>
        <h3 className="m-0 font-caption-bold text-caption-bold text-on-surface line-clamp-1">
          <Link to={`/bai-dang/${post.id}`} className="text-inherit no-underline hover:text-primary">{post.tieuDe}</Link>
        </h3>
        <p className="m-0 font-caption text-caption text-on-surface-variant line-clamp-1">{post.noiDung}</p>
        <div className="mt-auto flex items-center justify-between gap-space-sm pt-space-sm">
          <span className="min-w-0 truncate font-caption text-caption text-on-surface-variant" title={`${post.tenNguoiDang} · ${post.tenThanhPho} · ${timeAgo(post.ngayDang)}`}>
            {post.tenNguoiDang}
          </span>
          <Link to={`/bai-dang/${post.id}`} className="shrink-0 rounded-lg bg-primary-fixed/70 hover:bg-primary-fixed px-space-md py-space-xs font-caption-bold text-caption-bold text-primary no-underline transition-colors">
            Xem tin
          </Link>
        </div>
      </div>
    </article>
  );
}
