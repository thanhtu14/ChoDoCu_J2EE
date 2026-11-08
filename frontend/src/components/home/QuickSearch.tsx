import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { diaChiApi } from "../../api/diaChi";
import { useFetch } from "../../hooks/useFetch";
import MaterialIcon from "../common/MaterialIcon";

const HOT_KEYWORDS = ["iPhone 15 Pro Max", "MacBook Air M1", "Honda Vision 2022", "Ghế công thái học", "Máy ảnh Fujifilm"];

/** Khối tìm kiếm nhanh: từ khóa + khu vực + gợi ý hot. */
export default function QuickSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const cities = useFetch(() => diaChiApi.thanhPho(), []);

  const go = (keyword: string, thanhPho = city) => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (thanhPho) params.set("thanhPho", thanhPho);
    const s = params.toString();
    navigate(s ? `/tim-kiem?${s}` : "/tim-kiem");
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm sm:p-space-xl" aria-label="Tìm kiếm nhanh">
      <div className="flex flex-wrap items-start justify-between gap-space-sm">
        <div>
          <h2 className="m-0 flex items-center gap-space-xs font-headline-3 text-headline-3 text-on-surface">
            <span className="w-7 h-7 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center"><MaterialIcon name="manage_search" size={18} /></span>
            Tìm kiếm nhanh đồ cũ giá hời
          </h2>
          <p className="m-0 mt-space-2xs font-caption text-caption text-on-surface-variant">Tìm hàng ngàn tin đăng đã được kiểm duyệt, an toàn và minh bạch.</p>
        </div>
        <span className="inline-flex items-center gap-space-2xs rounded-full bg-secondary-container/50 px-space-sm py-space-2xs font-caption-bold text-caption-bold text-on-secondary-container">
          <MaterialIcon name="bolt" size={14} filled /> Tin mới cập nhật mỗi ngày
        </span>
      </div>

      <form onSubmit={submit} role="search" className="mt-space-lg flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-sm sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-space-sm px-space-sm">
          <MaterialIcon name="search" size={20} className="text-primary-container" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm: iPhone, MacBook, xe máy, bàn ghế cũ…"
            aria-label="Từ khóa tìm kiếm"
            className="w-full h-11 border-0 bg-transparent font-body-2 text-body-2 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-space-xs px-space-sm sm:border-l sm:border-outline-variant">
          <MaterialIcon name="location_on" size={18} className="text-primary-container" />
          <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Khu vực" className="h-11 border-0 bg-transparent font-caption-bold text-caption-bold text-on-surface focus:outline-none cursor-pointer">
            <option value="">Toàn quốc</option>
            {(cities.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.tenThanhPho}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-11 px-space-xl rounded-xl border-0 cursor-pointer bg-primary-container hover:bg-primary text-on-primary font-button-text text-button-text inline-flex items-center justify-center gap-space-xs transition-colors">
          <MaterialIcon name="search" size={18} /> Tìm kiếm
        </button>
      </form>

      <div className="mt-space-md flex flex-wrap items-center gap-space-xs">
        <span className="inline-flex items-center gap-space-2xs font-caption text-caption text-on-surface-variant">
          <MaterialIcon name="trending_up" size={14} className="text-primary-container" /> Gợi ý hot:
        </span>
        {HOT_KEYWORDS.map((k) => (
          <button key={k} type="button" onClick={() => go(k)} className="rounded-full border-0 cursor-pointer bg-surface-container-low hover:bg-primary-fixed px-space-md py-space-2xs font-caption text-caption text-on-surface transition-colors">
            {k}
          </button>
        ))}
      </div>
    </section>
  );
}
