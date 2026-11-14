export type TransactionStatus = "ThanhCong" | "ChoXacNhan" | "ThatBai" | "DaHoanTien";

export interface AdminTransaction {
  id: string;
  orderCode: string;
  service: string;
  product: string;
  customer: string;
  initials: string;
  amount: number;
  gateway: string;
  paymentMethod: string;
  createdAt: string;
  status: TransactionStatus;
  note?: string;
}

/** Nguồn dữ liệu duy nhất cho bản xem trước giao dịch; thay module này bằng API khi backend sẵn sàng. */
export const adminTransactionsSample: AdminTransaction[] = [
  { id: "GD98231", orderCode: "DV-10284", service: "Gói VIP Pro", product: "Đẩy tin nổi bật 7 ngày", customer: "Nguyễn Văn Tuấn", initials: "NT", amount: 200000, gateway: "VietQR", paymentMethod: "Chuyển khoản", createdAt: "2026-11-11T10:45:00+07:00", status: "ThanhCong" },
  { id: "GD98230", orderCode: "DV-10283", service: "Gói VIP Pro", product: "Gia hạn tin đăng", customer: "Đặng Quốc Tuấn", initials: "ĐT", amount: 550000, gateway: "MoMo", paymentMethod: "Ví MoMo", createdAt: "2026-11-11T09:30:00+07:00", status: "ThanhCong" },
  { id: "GD98229", orderCode: "DV-10282", service: "Gói Cơ bản", product: "Đẩy tin 3 ngày", customer: "Lê Văn Hùng", initials: "LH", amount: 100000, gateway: "VNPay QR", paymentMethod: "Quét mã QR", createdAt: "2026-11-11T08:15:00+07:00", status: "ChoXacNhan", note: "Chờ xác nhận" },
  { id: "GD98228", orderCode: "DV-10281", service: "Gói Gold Quyền ĐN", product: "Nâng cấp gian hàng", customer: "Cty TNHH Địa Dung", initials: "CT", amount: 1500000, gateway: "Chuyển khoản NH", paymentMethod: "MB Bank", createdAt: "2026-11-10T16:20:00+07:00", status: "ThanhCong" },
  { id: "GD98225", orderCode: "DV-10278", service: "Gói VIP Pro", product: "Gia hạn tin đăng", customer: "Bùi Quang Huy", initials: "BH", amount: 200000, gateway: "Thẻ tín dụng", paymentMethod: "Visa / Mastercard", createdAt: "2026-11-10T14:10:00+07:00", status: "DaHoanTien", note: "Lỗi / Hoàn tiền" },
  { id: "GD98220", orderCode: "DV-10273", service: "Gói VIP Pro", product: "Đẩy tin nổi bật 7 ngày", customer: "Phan Anh Tuấn", initials: "PA", amount: 600000, gateway: "VietQR", paymentMethod: "MB Bank", createdAt: "2026-11-10T11:30:00+07:00", status: "ThanhCong" },
  { id: "GD98218", orderCode: "DV-10271", service: "Gói Cơ bản", product: "Đẩy tin 3 ngày", customer: "Trần Thị Mai", initials: "TM", amount: 200000, gateway: "Chuyển khoản NH", paymentMethod: "Agribank", createdAt: "2026-11-09T09:10:00+07:00", status: "ChoXacNhan" },
  { id: "GD98214", orderCode: "DV-10267", service: "Gói Cơ bản", product: "Đẩy tin 3 ngày", customer: "Hoàng Văn Long", initials: "HL", amount: 100000, gateway: "MoMo", paymentMethod: "Ví MoMo", createdAt: "2026-11-08T08:05:00+07:00", status: "ThatBai", note: "Thanh toán thất bại" },
  { id: "GD98211", orderCode: "DV-10264", service: "Gói VIP Pro", product: "Gia hạn tin đăng", customer: "Nguyễn Thị Lan", initials: "NL", amount: 350000, gateway: "VNPay QR", paymentMethod: "Quét mã QR", createdAt: "2026-11-07T15:42:00+07:00", status: "ThanhCong" },
  { id: "GD98205", orderCode: "DV-10258", service: "Gói VIP Pro", product: "Đẩy tin nổi bật 7 ngày", customer: "Trương Minh Khoa", initials: "TK", amount: 450000, gateway: "VietQR", paymentMethod: "Chuyển khoản", createdAt: "2026-11-06T13:24:00+07:00", status: "ThanhCong" },
  { id: "GD98198", orderCode: "DV-10251", service: "Gói Cơ bản", product: "Đẩy tin 3 ngày", customer: "Đỗ Hoài An", initials: "ĐA", amount: 100000, gateway: "MoMo", paymentMethod: "Ví MoMo", createdAt: "2026-11-05T17:06:00+07:00", status: "ThanhCong" },
  { id: "GD98192", orderCode: "DV-10245", service: "Gói Gold", product: "Nâng cấp gian hàng", customer: "Cửa hàng An Nhiên", initials: "AN", amount: 1200000, gateway: "VNPay QR", paymentMethod: "Quét mã QR", createdAt: "2026-11-04T10:12:00+07:00", status: "DaHoanTien" },
];

export const formatTransactionMoney = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;
