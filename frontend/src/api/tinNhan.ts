import client from "./client";
import type { HoiThoai, PagedResult, TinNhan } from "../types";

type ApiHoiThoai = {
  id: number;
  idNguoiDung?: number;
  idNguoiDungKia?: number;
  hoTen?: string;
  tenNguoiDungKia?: string;
  anhNguoiDung?: string | null;
  anhNguoiDungKia?: string | null;
  tinNhanCuoi?: { noiDung?: string } | string | null;
};
type ApiTinNhan = Omit<TinNhan, "daXem" | "ngayTao"> & { daXem?: boolean; daDoc?: boolean; ngayTao?: string; ngayGui?: string };

export const tinNhanApi = {
  hoiThoai: () => client.get<ApiHoiThoai[]>("/tin-nhan/hoi-thoai").then((r) => r.data.map((h): HoiThoai => ({
    id: h.id,
    idNguoiDungKia: h.idNguoiDungKia ?? h.idNguoiDung ?? 0,
    tenNguoiDungKia: h.tenNguoiDungKia ?? h.hoTen ?? "",
    anhNguoiDungKia: h.anhNguoiDungKia ?? h.anhNguoiDung ?? null,
    tinNhanCuoi: typeof h.tinNhanCuoi === "object" && h.tinNhanCuoi !== null ? h.tinNhanCuoi.noiDung ?? null : h.tinNhanCuoi ?? null,
  }))),
  /** page 1 = tin mới nhất; mỗi trang BE trả theo thứ tự thời gian tăng dần. */
  tinNhan: (idHoiThoai: number, page = 1, pageSize = 30) =>
    client
      .get<PagedResult<ApiTinNhan>>(`/tin-nhan/hoi-thoai/${idHoiThoai}`, { params: { page, pageSize } })
      .then((r) => ({ ...r.data, items: r.data.items.map((m): TinNhan => ({ ...m, daXem: m.daXem ?? m.daDoc ?? false, ngayTao: m.ngayTao ?? m.ngayGui ?? "" })) })),
  gui: (idNguoiNhan: number, noiDung: string) =>
    client.post<TinNhan>("/tin-nhan", { idNguoiNhan, noiDung }).then((r) => r.data),
};
