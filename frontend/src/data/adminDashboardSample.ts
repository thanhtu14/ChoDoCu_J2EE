import type { BaiDang, BaoCao } from "../types";

export interface AdminDashboardData {
  posts: { items: BaiDang[]; totalCount: number };
  users: { totalCount: number };
  reports: { items: BaoCao[]; totalCount: number };
  monthlyActivity: { month: string; userRegistrations: number; posts: number }[];
}

/** Dữ liệu mẫu để xem trước đầy đủ bố cục dashboard khi API chưa có dữ liệu. */
export class AdminDashboardSampleData {
  static create(): AdminDashboardData {
    const ago = (days: number, hours = 0) => new Date(Date.now() - (days * 24 + hours) * 60 * 60 * 1000).toISOString();
    const posts: BaiDang[] = [
      { id: 1048, tieuDe: "Honda SH 150i ABS 2022, xe đẹp, máy êm", noiDung: "Xe gia đình sử dụng, bảo dưỡng định kỳ.", tenSanPham: "Honda SH 150i ABS", giaTien: 82400000, diaChi: "Quận 7, TP. Hồ Chí Minh", diaChiChiTiet: "Đường Nguyễn Thị Thập", ngayDang: ago(0, 2), trangThai: "DaDuyet", idNguoiDung: 12, tenNguoiDang: "Nguyễn Minh", tenDanhMuc: "Xe máy", tenThanhPho: "TP. Hồ Chí Minh", anhs: [] },
      { id: 1047, tieuDe: "Yamaha NVX 155, chính chủ, odo thấp", noiDung: "Xe còn tốt, sang tên nhanh gọn.", tenSanPham: "Yamaha NVX 155", giaTien: 32900000, diaChi: "Quận Bình Thạnh, TP. Hồ Chí Minh", diaChiChiTiet: "Đường Xô Viết Nghệ Tĩnh", ngayDang: ago(0, 5), trangThai: "DaDuyet", idNguoiDung: 18, tenNguoiDang: "Trần Gia Bảo", tenDanhMuc: "Xe máy", tenThanhPho: "TP. Hồ Chí Minh", anhs: [] },
      { id: 1046, tieuDe: "Air Blade 160 2023, màu đen nhám", noiDung: "Xe đi giữ gìn, giấy tờ đầy đủ.", tenSanPham: "Honda Air Blade 160", giaTien: 41200000, diaChi: "Quận Cầu Giấy, Hà Nội", diaChiChiTiet: "Phố Trần Thái Tông", ngayDang: ago(1), trangThai: "ChoDuyet", idNguoiDung: 21, tenNguoiDang: "Lê Hoàng Nam", tenDanhMuc: "Xe máy", tenThanhPho: "Hà Nội", anhs: [] },
      { id: 1045, tieuDe: "iPhone 14 Pro 256GB, pin 91%", noiDung: "Máy đẹp, đầy đủ phụ kiện.", tenSanPham: "iPhone 14 Pro", giaTien: 15900000, diaChi: "Quận 1, TP. Hồ Chí Minh", diaChiChiTiet: "Đường Lê Thánh Tôn", ngayDang: ago(1, 4), trangThai: "DaDuyet", idNguoiDung: 8, tenNguoiDang: "Phạm Thảo", tenDanhMuc: "Điện thoại & Công nghệ", tenThanhPho: "TP. Hồ Chí Minh", anhs: [] },
      { id: 1044, tieuDe: "Bàn gỗ sồi tự nhiên, còn rất mới", noiDung: "Bàn chắc chắn, phù hợp căn hộ.", tenSanPham: "Bàn gỗ sồi", giaTien: 2450000, diaChi: "Quận Hải Châu, Đà Nẵng", diaChiChiTiet: "Đường Nguyễn Văn Linh", ngayDang: ago(2), trangThai: "DaDuyet", idNguoiDung: 6, tenNguoiDang: "Đỗ Quang", tenDanhMuc: "Đồ gia dụng & Nội thất", tenThanhPho: "Đà Nẵng", anhs: [] },
      { id: 1043, tieuDe: "Máy ảnh Canon EOS M50 Mark II", noiDung: "Hoạt động hoàn hảo, tặng kèm túi.", tenSanPham: "Canon EOS M50 II", giaTien: 11200000, diaChi: "Quận 3, TP. Hồ Chí Minh", diaChiChiTiet: "Đường Võ Văn Tần", ngayDang: ago(2, 5), trangThai: "ChoDuyet", idNguoiDung: 31, tenNguoiDang: "Vũ Anh Khoa", tenDanhMuc: "Điện thoại & Công nghệ", tenThanhPho: "TP. Hồ Chí Minh", anhs: [] },
      { id: 1042, tieuDe: "Sofa chữ L màu kem, thanh lý chuyển nhà", noiDung: "Sofa sạch sẽ, không rách xước.", tenSanPham: "Sofa chữ L", giaTien: 5800000, diaChi: "TP. Thủ Đức, TP. Hồ Chí Minh", diaChiChiTiet: "Khu đô thị Vạn Phúc", ngayDang: ago(3), trangThai: "DaDuyet", idNguoiDung: 42, tenNguoiDang: "Mai Khánh", tenDanhMuc: "Đồ gia dụng & Nội thất", tenThanhPho: "TP. Hồ Chí Minh", anhs: [] },
      { id: 1041, tieuDe: "Đồng hồ Seiko Presage Automatic", noiDung: "Hàng chính hãng, còn hộp và thẻ.", tenSanPham: "Seiko Presage", giaTien: 6900000, diaChi: "Quận Hoàn Kiếm, Hà Nội", diaChiChiTiet: "Phố Hàng Bài", ngayDang: ago(4), trangThai: "DaDuyet", idNguoiDung: 13, tenNguoiDang: "Ngô Đức", tenDanhMuc: "Thời trang & Phụ kiện", tenThanhPho: "Hà Nội", anhs: [] },
      { id: 1040, tieuDe: "MacBook Air M1 8GB/256GB, ngoại hình đẹp", noiDung: "Máy dùng văn phòng, pin tốt.", tenSanPham: "MacBook Air M1", giaTien: 14200000, diaChi: "Quận Ninh Kiều, Cần Thơ", diaChiChiTiet: "Đường 30 Tháng 4", ngayDang: ago(5), trangThai: "DaDuyet", idNguoiDung: 27, tenNguoiDang: "Bùi Thanh", tenDanhMuc: "Điện thoại & Công nghệ", tenThanhPho: "Cần Thơ", anhs: [] },
    ];
    const reports: BaoCao[] = [
      { id: 702, idBaiDang: 1046, tieuDeBaiDang: "Air Blade 160 2023, màu đen nhám", idNguoiDung: 52, tenNguoiBaoCao: "Phan Hoài", noiDung: "Giá và hình ảnh có dấu hiệu không khớp.", ngayTao: ago(0, 1), trangThai: "ChoXuLy" },
      { id: 701, idBaiDang: 1038, tieuDeBaiDang: "Bán điện thoại giá rẻ bất thường", idNguoiDung: 41, tenNguoiBaoCao: "Linh Nguyễn", noiDung: "Nghi ngờ lừa đảo, yêu cầu đặt cọc.", ngayTao: ago(0, 4), trangThai: "ChoXuLy" },
      { id: 700, idBaiDang: 1032, tieuDeBaiDang: "Tủ lạnh mini còn mới", idNguoiDung: 17, tenNguoiBaoCao: "Trần Minh", noiDung: "Tin đăng sai danh mục.", ngayTao: ago(1, 3), trangThai: "DaXuLy" },
      { id: 699, idBaiDang: 1028, tieuDeBaiDang: "Đồng hồ thời trang", idNguoiDung: 33, tenNguoiBaoCao: "Nguyễn An", noiDung: "Ảnh sản phẩm không rõ nguồn gốc.", ngayTao: ago(2), trangThai: "DaXuLy" },
    ];
    const monthlyActivity = [
      { month: "T1", userRegistrations: 318, posts: 426 },
      { month: "T2", userRegistrations: 352, posts: 498 },
      { month: "T3", userRegistrations: 405, posts: 572 },
      { month: "T4", userRegistrations: 388, posts: 548 },
      { month: "T5", userRegistrations: 462, posts: 650 },
      { month: "T6", userRegistrations: 510, posts: 714 },
      { month: "T7", userRegistrations: 486, posts: 682 },
      { month: "T8", userRegistrations: 558, posts: 778 },
      { month: "T9", userRegistrations: 602, posts: 846 },
      { month: "T10", userRegistrations: 645, posts: 902 },
      { month: "T11", userRegistrations: 704, posts: 976 },
      { month: "T12", userRegistrations: 762, posts: 1084 },
    ];
    return { posts: { items: posts, totalCount: 68240 }, users: { totalCount: 14320 }, reports: { items: reports, totalCount: 428 }, monthlyActivity };
  }
}
