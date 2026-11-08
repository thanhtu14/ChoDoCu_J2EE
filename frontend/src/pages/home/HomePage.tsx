import { Link } from "react-router-dom";
import { baiDangApi } from "../../api/baiDang";
import { danhMucApi } from "../../api/danhMuc";
import { DUNG_DU_LIEU_MAU, TIN_DAY_MAU } from "../../data/tinDayMau";
import { ErrorBox, Spinner } from "../../components/common/State";
import CategoryGrid from "../../components/home/CategoryGrid";
import HeroBanner from "../../components/home/HeroBanner";
import BoostedStrip from "../../components/home/BoostedStrip";
import QuickSearch from "../../components/home/QuickSearch";
import RecommendedGrid from "../../components/home/RecommendedGrid";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";

/** Trang chủ: banner → tìm nhanh → danh mục → tin mới → gợi ý. Mỗi khối là một component ở components/home. */
export default function HomePage() {
  useDocumentTitle();
  const categories = useFetch(() => danhMucApi.cay(), []);
  const latest = useFetch(() => baiDangApi.tim({ page: 1, pageSize: 1 }), []);
  // Tin đang đẩy: dùng dữ liệu mẫu khi BE chưa có endpoint (data/tinDayMau.ts); nếu API lỗi hoặc rỗng thì ẩn khối.
  const boosted = useFetch(() => (DUNG_DU_LIEU_MAU ? Promise.resolve(TIN_DAY_MAU) : baiDangApi.noiBat(12).catch(() => [])), []);
  const tree = categories.data ?? [];

  return (
    <div className="flex flex-col gap-space-2xl pb-space-2xl">
      <HeroBanner />
      <QuickSearch />

      <section aria-labelledby="cat-title">
        <div className="mb-space-md flex items-end justify-between gap-space-sm">
          <div>
            <h2 id="cat-title" className="m-0 font-headline-2 text-headline-2 text-on-surface">Danh mục khám phá</h2>
            <p className="m-0 mt-space-2xs font-caption text-caption text-on-surface-variant">{latest.data ? `${latest.data.totalCount} tin đăng đã kiểm duyệt đang có trên chợ.` : "Chọn danh mục để xem tin đăng."}</p>
          </div>
          <Link to="/tim-kiem" className="font-caption-bold text-caption-bold text-primary-container no-underline hover:underline">Xem tất cả</Link>
        </div>
        {categories.loading ? <Spinner /> : categories.error ? <ErrorBox message={categories.error} onRetry={categories.reload} /> : <CategoryGrid categories={tree} />}
      </section>

      {boosted.data && boosted.data.length > 0 && <BoostedStrip posts={boosted.data} />}

      <RecommendedGrid categories={tree} />
    </div>
  );
}
