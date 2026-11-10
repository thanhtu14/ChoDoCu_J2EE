import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { danhMucApi } from "../../api/danhMuc";
import { useFetch } from "../../hooks/useFetch";
import type { DanhMuc } from "../../types";
import MaterialIcon from "../common/MaterialIcon";

const iconFor = (name: string) => {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/bat dong san|nha dat/.test(normalized)) return "apartment";
  if (/xe|oto|o to|phuong tien/.test(normalized)) return "two_wheeler";
  if (/dien tu|dien thoai|may tinh/.test(normalized)) return "devices";
  if (/viec lam|cong viec/.test(normalized)) return "work";
  if (/dich vu|cham soc/.test(normalized)) return "home_repair_service";
  if (/thu cung|cho|meo/.test(normalized)) return "pets";
  if (/do an|thuc pham|do uong/.test(normalized)) return "restaurant";
  return "category";
};

export default function CategoryMenu() {
  const { data: categories, loading } = useFetch(() => danhMucApi.cay(), []);
  const data = categories ?? [];
  const [activeId, setActiveId] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useMemo(
    () => data.find((category) => category.id === activeId) ?? data[0],
    [activeId, data],
  );

  const categoryLink = (category: DanhMuc) => `/tim-kiem?danhMuc=${category.id}`;

  return (
    <div
      className="category-menu"
      onMouseEnter={() => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = null;
        setActiveId((current) => current ?? data[0]?.id ?? null);
      }}
      onMouseLeave={() => {
        closeTimer.current = setTimeout(() => setActiveId(null), 80);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          if (closeTimer.current) clearTimeout(closeTimer.current);
          closeTimer.current = null;
          setActiveId(null);
        }
      }}
    >
      <div className="category-menu-trigger" aria-hidden="true">
        <span className={`category-menu-hamburger${activeId !== null ? " is-open" : ""}`}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="category-menu-panel">
        <div className="category-menu-heading">Danh mục</div>
        {loading ? (
          <div className="category-menu-empty">Đang tải danh mục…</div>
        ) : data.length === 0 ? (
          <div className="category-menu-empty">Chưa có danh mục</div>
        ) : (
          <div className={`category-menu-columns${active?.danhMucCons?.length ? " has-children" : ""}`}>
            <div className="category-menu-parents">
              {data.map((category) => (
                <Link
                  key={category.id}
                  to={categoryLink(category)}
                  className={`category-menu-parent${active?.id === category.id ? " is-active" : ""}`}
                  onMouseEnter={() => {
                    setActiveId(category.id);
                  }}
                  onFocus={() => setActiveId(category.id)}
                >
                  <MaterialIcon name={iconFor(category.tenDanhMuc)} size={18} />
                  <span>{category.tenDanhMuc}</span>
                  {category.danhMucCons?.length > 0 && <MaterialIcon name="chevron_right" size={17} className="category-menu-chevron" />}
                </Link>
              ))}
            </div>
            {active?.danhMucCons?.length ? (
              <div className="category-menu-children">
                {active.danhMucCons.map((child) => (
                  <Link key={child.id} to={categoryLink(child)} className="category-menu-child">
                    <span>{child.tenDanhMuc}</span>
                    <MaterialIcon name="arrow_outward" size={14} />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

