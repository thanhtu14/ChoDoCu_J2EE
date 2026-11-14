export interface AdminServicePlanSample {
  id: number;
  name: string;
  tier: string;
  description: string;
  durationDays: number;
  boosts: number;
  price: number;
  purchases: number;
  revenue: number;
  active: boolean;
  color: "green" | "orange" | "gray" | "gold" | "blue";
}

export const adminServicePlansSample: AdminServicePlanSample[] = [
  { id: 1, name: "Gói Miễn Phí", tier: "Cơ bản", description: "Khởi đầu bán hàng trên Chợ Đồ Cũ", durationDays: 7, boosts: 0, price: 0, purchases: 3420, revenue: 0, active: true, color: "green" },
  { id: 2, name: "Gói Tiêu Chuẩn Nổi Bật", tier: "Phổ biến", description: "Tăng hiển thị và tiếp cận người mua", durationDays: 30, boosts: 5, price: 200000, purchases: 986, revenue: 197200000, active: true, color: "orange" },
  { id: 3, name: "Gói Cơ Bản", tier: "Tiết kiệm", description: "Phù hợp người bán cá nhân", durationDays: 30, boosts: 3, price: 100000, purchases: 1250, revenue: 125000000, active: true, color: "gray" },
  { id: 4, name: "Gói Siêu Đẩy Pro", tier: "VIP Pro", description: "Đẩy tin mạnh, ưu tiên hiển thị", durationDays: 30, boosts: 20, price: 550000, purchases: 468, revenue: 257400000, active: true, color: "gold" },
  { id: 5, name: "Gói Doanh Nghiệp VIP", tier: "Doanh nghiệp", description: "Bộ công cụ toàn diện cho cửa hàng", durationDays: 90, boosts: 100, price: 1500000, purchases: 174, revenue: 261000000, active: true, color: "gray" },
  { id: 6, name: "Gói Đẩy Tin Nhanh", tier: "Linh hoạt", description: "Đẩy nhanh một tin đăng bất kỳ", durationDays: 7, boosts: 1, price: 50000, purchases: 720, revenue: 36000000, active: false, color: "orange" },
];

export const adminServiceRevenueSample = {
  totalRevenue: 1285400000,
  monthRevenue: 156200000,
  averageOrder: 216000,
  activeSubscribers: 8420,
  monthly: [
    { month: "Tháng 01/2026", revenue: 148500000, purchases: 980, bestSeller: "Gói Tiêu Chuẩn Nổi Bật", growth: 4.2 },
    { month: "Tháng 02/2026", revenue: 142500000, purchases: 940, bestSeller: "Gói Cơ Bản", growth: -5.7 },
    { month: "Tháng 03/2026", revenue: 156200000, purchases: 1050, bestSeller: "Gói Siêu Đẩy Pro", growth: 10.3 },
    { month: "Tháng 04/2026", revenue: 132000000, purchases: 880, bestSeller: "Gói Tiêu Chuẩn Nổi Bật", growth: 4.6 },
    { month: "Tháng 05/2026", revenue: 124000000, purchases: 810, bestSeller: "Gói Cơ Bản", growth: 10.2 },
    { month: "Tháng 06/2026", revenue: 112500000, purchases: 740, bestSeller: "Gói Tiêu Chuẩn Nổi Bật", growth: 3.1 },
    { month: "Tháng 07/2026", revenue: 469700000, purchases: 3020, bestSeller: "Gói Doanh Nghiệp VIP", growth: 15.0 },
  ],
};
