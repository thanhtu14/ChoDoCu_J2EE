import client from "./client";
import type { NguoiDungListItem, PagedResult, PhanQuyenNguoiDung, QuyenItem, VaiTroItem } from "../types";

export const quanTriNguoiDungApi = {
  danhSach: (params: { keyword?: string; trangThai?: string; role?: string; page: number; pageSize: number }) =>
    client.get<PagedResult<NguoiDungListItem>>("/nguoi-dung", { params }).then((r) => r.data),
  khoa: (id: number) => client.put(`/nguoi-dung/${id}/khoa`).then(() => undefined),
  moKhoa: (id: number) => client.put(`/nguoi-dung/${id}/mo-khoa`).then(() => undefined),
};

export const phanQuyenApi = {
  quyen: () => client.get<QuyenItem[]>("/phan-quyen/quyen").then((r) => r.data),
  vaiTro: () => client.get<VaiTroItem[]>("/phan-quyen/vai-tro").then((r) => r.data),
  taoVaiTro: (data: { ten: string; quyen: string[] }) => client.post<VaiTroItem>("/phan-quyen/vai-tro", data).then((r) => r.data),
  capNhatVaiTro: (id: number, data: { ten?: string; quyen?: string[] }) =>
    client.put<VaiTroItem>(`/phan-quyen/vai-tro/${id}`, data).then((r) => r.data),
  xoaVaiTro: (id: number) => client.delete(`/phan-quyen/vai-tro/${id}`).then(() => undefined),
  nguoiDung: (id: number) => client.get<PhanQuyenNguoiDung>(`/phan-quyen/nguoi-dung/${id}`).then((r) => r.data),
  capNhatNguoiDung: (id: number, data: { vaiTro: string[]; quyenRieng: string[] }) =>
    client.put<PhanQuyenNguoiDung>(`/phan-quyen/nguoi-dung/${id}`, data).then((r) => r.data),
};
