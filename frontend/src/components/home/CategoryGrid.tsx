import { Link } from "react-router-dom";
import type { DanhMuc } from "../../types";
import MaterialIcon from "../common/MaterialIcon";

const strip = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();

const ICONS: [RegExp, string][] = [
  [/dien thoai|phone/, "phone_iphone"],
  [/laptop|may tinh|vi tinh/, "laptop_mac"],
  [/xe|oto|o to/, "two_wheeler"],
  [/gia dung|bep|tu lanh/, "kitchen"],
  [/noi that|ban ghe|giuong/, "chair"],
  [/thoi trang|quan ao|vintage|giay/, "checkroom"],
  [/dien tu|may anh|am thanh|tai nghe/, "devices"],
  [/sach|van phong/, "menu_book"],
  [/the thao|giai tri/, "sports_soccer"],
];
const iconFor = (name: string) =>
  ICONS.find(([re]) => re.test(strip(name)))?.[1] ?? "category";

/** Lưới danh mục gốc (tối đa 6) có icon theo tên. */
export default function CategoryGrid({ categories }: { categories: DanhMuc[] }) {
  return (
    <div className="grid grid-cols-2 gap-space-md sm:grid-cols-3 lg:grid-cols-6">
      {categories.slice(0, 6).map((c) => (
        <Link
          key={c.id}
          to={`/tim-kiem?danhMuc=${c.id}`}
          className="group flex flex-col items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg text-center no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="w-12 h-12 rounded-xl bg-primary-fixed/60 text-primary-container flex items-center justify-center transition-colors group-hover:bg-primary-container group-hover:text-on-primary">
            <MaterialIcon
              name={iconFor(c.tenDanhMuc)}
              size={26}
            />
          </span>
          <span className="font-caption-bold text-caption-bold text-on-surface">
            {c.tenDanhMuc}
          </span>
          {c.danhMucCons.length > 0 && (
            <span className="font-caption text-caption text-on-surface-variant">
              {c.danhMucCons.length} danh mục con
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
