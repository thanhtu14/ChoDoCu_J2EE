import client from "./client";
import type { CapNhatHoSoRequest, HoSoNguoiDung } from "../types";

export const nguoiDungApi = {
  layHoSo: () => client.get<HoSoNguoiDung & { idNguoiDung?: number }>("/nguoi-dung/me").then((r) => ({ ...r.data, id: r.data.id ?? r.data.idNguoiDung! })),
  capNhatHoSo: (data: CapNhatHoSoRequest) => client.put<HoSoNguoiDung & { idNguoiDung?: number }>("/nguoi-dung/me", data).then((r) => ({ ...r.data, id: r.data.id ?? r.data.idNguoiDung! })),
  /** Bước 1 đổi số điện thoại: BE gửi mã 6 chữ số tới email tài khoản. */
  yeuCauDoiSoDienThoai: (soDienThoaiMoi: string) =>
    client.post<{ message: string }>("/nguoi-dung/me/doi-so-dien-thoai/yeu-cau", { soDienThoaiMoi }).then((r) => r.data),
  /** Bước 2: nhập mã nhận qua email; trả về hồ sơ đã cập nhật. */
  xacNhanDoiSoDienThoai: (soDienThoaiMoi: string, maXacNhan: string) =>
    client.post<HoSoNguoiDung & { idNguoiDung?: number }>("/nguoi-dung/me/doi-so-dien-thoai/xac-nhan", { soDienThoaiMoi, maXacNhan }).then((r) => ({ ...r.data, id: r.data.id ?? r.data.idNguoiDung! })),
};
