import type { TrangThaiBaiDang } from "../types";

/** Dữ liệu demo cho màn quản trị; thay module này bằng API khi backend sẵn sàng. */
export interface AdminPost {
  id: number;
  title: string;
  category: string;
  seller: string;
  phone: string;
  price: number;
  location: string;
  postedAt: string;
  status: TrangThaiBaiDang;
  image: string;
  description: string;
}

export const adminPosts: AdminPost[] = [
  { id: 12450, title: "Laptop Dell Latitude 7420 i7, RAM 16GB", category: "Laptop · Máy tính", seller: "Nguyễn Văn An", phone: "0912 345 678", price: 12450000, location: "Quận 3, TP. Hồ Chí Minh", postedAt: "10:30 · Hôm nay", status: "ChoDuyet", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=200&q=80", description: "Máy còn đẹp, hoạt động ổn định. Có sạc theo máy và hỗ trợ kiểm tra trực tiếp." },
  { id: 12449, title: "iPhone 14 Pro 128GB màu tím, máy đẹp", category: "Điện thoại · Apple", seller: "Võ Minh Quân", phone: "0903 221 778", price: 18900000, location: "Quận 10, TP. Hồ Chí Minh", postedAt: "10:05 · Hôm nay", status: "ChoDuyet", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80", description: "iPhone 14 Pro bản 128GB, pin tốt, ngoại hình đẹp. Tặng ốp lưng và cáp sạc." },
  { id: 12448, title: "Laptop Dell Latitude 5410 chính hãng", category: "Laptop · Máy tính", seller: "Lê Văn Hùng", phone: "0988 120 660", price: 8500000, location: "Thủ Đức, TP. Hồ Chí Minh", postedAt: "09:20 · Hôm nay", status: "DaDuyet", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80", description: "Laptop văn phòng, máy chạy nhanh, màn hình đẹp, có thể xem máy tại nhà." },
  { id: 12447, title: "Máy giặt Electrolux cửa ngang 9kg", category: "Điện máy · Gia dụng", seller: "Đặng Quốc Tuấn", phone: "0931 540 891", price: 4800000, location: "Gò Vấp, TP. Hồ Chí Minh", postedAt: "Hôm qua · 18:20", status: "DaDuyet", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&q=80", description: "Máy giặt cửa trước còn sử dụng tốt, giặt êm, tiết kiệm điện. Hỗ trợ vận chuyển." },
  { id: 12446, title: "Bộ ghế sofa phòng khách thanh lý", category: "Nội thất · Sofa", seller: "Bùi Quang Huy", phone: "0917 444 202", price: 0, location: "Bình Thạnh, TP. Hồ Chí Minh", postedAt: "Hôm qua · 16:10", status: "TuChoi", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80", description: "Bài đăng bị từ chối do thông tin giá và hình ảnh chưa đáp ứng quy định." },
  { id: 12445, title: "Xe đạp thể thao Giant Escape 3", category: "Xe cộ · Xe đạp", seller: "Trần Hải Nam", phone: "0977 015 332", price: 3200000, location: "Tân Bình, TP. Hồ Chí Minh", postedAt: "Hôm qua · 14:45", status: "DaAn", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=200&q=80", description: "Xe đạp đi phố, vừa bảo dưỡng, sang số nhẹ. Bán tại nhà, giá có thể thương lượng." },
];
