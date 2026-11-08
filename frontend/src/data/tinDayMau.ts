import type { BaiDang } from "../types";

/**
 * Dữ liệu mẫu cho khối "Tin đang được đẩy" ở trang chủ, dùng khi BE chưa có GET /api/bai-dang/noi-bat.
 * Khi BE xong: đổi DUNG_DU_LIEU_MAU thành false (hoặc xóa file này và đoạn dùng nó trong HomePage).
 */
export const DUNG_DU_LIEU_MAU = true;

/** Ảnh minh họa dạng SVG nội tuyến (không cần file ảnh/mạng). */
function anhMau(tieuDe: string, tu: string, den: string): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${tu}'/><stop offset='1' stop-color='${den}'/></linearGradient></defs>` +
    `<rect width='640' height='400' fill='url(#g)'/>` +
    `<circle cx='520' cy='80' r='120' fill='rgba(255,255,255,.14)'/><circle cx='90' cy='340' r='150' fill='rgba(255,255,255,.1)'/>` +
    `<text x='320' y='215' text-anchor='middle' font-family='Arial,sans-serif' font-size='34' font-weight='700' fill='white'>${tieuDe}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const ngay = (soGioTruoc: number) => new Date(Date.now() - soGioTruoc * 3_600_000).toISOString();
const hetHan = (soNgay: number) => new Date(Date.now() + soNgay * 86_400_000).toISOString();

type Mau = Pick<BaiDang, "tieuDe" | "giaTien" | "tenDanhMuc" | "tenThanhPho" | "tenNguoiDang"> & { tu: string; den: string; gio: number; ngayConLai: number };

const MAU: Mau[] = [
  { tieuDe: "Dell XPS 13 9310 i7/16GB/512GB mỏng nhẹ", giaTien: 16_500_000, tenDanhMuc: "Laptop", tenThanhPho: "Hà Nội", tenNguoiDang: "Trần Thị Bình", tu: "#334155", den: "#0f172a", gio: 2, ngayConLai: 28 },
  { tieuDe: "iPhone 14 Pro 256GB tím, pin 92%", giaTien: 20_900_000, tenDanhMuc: "Điện thoại", tenThanhPho: "Hà Nội", tenNguoiDang: "Trần Thị Bình", tu: "#7c3aed", den: "#4c1d95", gio: 5, ngayConLai: 6 },
  { tieuDe: "Honda Vision 2023 chính chủ, đi 6.000km", giaTien: 28_000_000, tenDanhMuc: "Xe máy", tenThanhPho: "TP. Hồ Chí Minh", tenNguoiDang: "Lê Hoàng Cường", tu: "#0ea5a4", den: "#115e59", gio: 9, ngayConLai: 12 },
  { tieuDe: "Galaxy S22 Ultra 256GB còn bảo hành", giaTien: 13_900_000, tenDanhMuc: "Điện thoại", tenThanhPho: "TP. Hồ Chí Minh", tenNguoiDang: "Nguyễn Văn An", tu: "#2563eb", den: "#1e3a8a", gio: 14, ngayConLai: 3 },
  { tieuDe: "iPhone 13 128GB xanh, pin 89%", giaTien: 11_500_000, tenDanhMuc: "Điện thoại", tenThanhPho: "TP. Hồ Chí Minh", tenNguoiDang: "Nguyễn Văn An", tu: "#0891b2", den: "#164e63", gio: 20, ngayConLai: 5 },
  { tieuDe: "Ghế công thái học Herman Miller Aeron", giaTien: 3_200_000, tenDanhMuc: "Nội thất", tenThanhPho: "Đà Nẵng", tenNguoiDang: "Phạm Thu Hà", tu: "#b45309", den: "#78350f", gio: 26, ngayConLai: 20 },
  { tieuDe: "MacBook Air M1 256GB đẹp 98%", giaTien: 13_900_000, tenDanhMuc: "Laptop", tenThanhPho: "Hà Nội", tenNguoiDang: "Đỗ Minh Quân", tu: "#475569", den: "#1e293b", gio: 30, ngayConLai: 9 },
  { tieuDe: "Tặng lại bộ sách văn học 20+ cuốn", giaTien: 0, tenDanhMuc: "Sách", tenThanhPho: "Cần Thơ", tenNguoiDang: "Võ Ngọc Lan", tu: "#16a34a", den: "#14532d", gio: 40, ngayConLai: 2 },
];

export const TIN_DAY_MAU: BaiDang[] = MAU.map((m, i) => ({
  id: 9000 + i,
  tieuDe: m.tieuDe,
  noiDung: "Tin mẫu để xem giao diện khối tin được đẩy.",
  tenSanPham: m.tieuDe,
  giaTien: m.giaTien,
  diaChi: m.tenThanhPho,
  diaChiChiTiet: "",
  ngayDang: ngay(m.gio),
  trangThai: "DaDuyet",
  idNguoiDung: 0,
  tenNguoiDang: m.tenNguoiDang,
  tenDanhMuc: m.tenDanhMuc,
  tenThanhPho: m.tenThanhPho,
  anhs: [anhMau(m.tenDanhMuc, m.tu, m.den)],
  hetHanDayTin: hetHan(m.ngayConLai),
}));
