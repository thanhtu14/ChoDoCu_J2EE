import { useState } from "react";
import { quanTriNguoiDungApi } from "../../api/quanTri";
import UserRolesDialog from "../../components/admin/UserRolesDialog";
import { Card } from "../../components/account/FormControls";
import Pagination from "../../components/common/Pagination";
import { Empty, ErrorBox } from "../../components/common/State";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../utils/error";
import { formatDate } from "../../utils/format";

const select =
  "h-11 rounded-xl border-0 bg-surface-container-low px-space-md font-body-2 text-body-2 text-on-surface";
const smallBtn =
  "h-9 px-space-md rounded-lg border-0 cursor-pointer font-caption-bold text-caption-bold transition-colors";

export default function AdminUsers() {
  useDocumentTitle("Quản lý người dùng");
  const toast = useToast();
  const { user, isAdmin } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const { data, loading, error, reload } = useFetch(
    () =>
      quanTriNguoiDungApi.danhSach({
        keyword: search || undefined,
        trangThai: trangThai || undefined,
        role: role || undefined,
        page,
        pageSize: 15,
      }),
    [search, trangThai, role, page],
  );

  const toggleLock = async (id: number, locked: boolean) => {
    if (
      !locked &&
      !window.confirm("Khóa tài khoản này? Người dùng sẽ không đăng nhập được.")
    )
      return;
    setBusyId(id);
    try {
      if (locked) await quanTriNguoiDungApi.moKhoa(id);
      else await quanTriNguoiDungApi.khoa(id);
      toast(locked ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.", "ok");
      reload();
    } catch (err) {
      toast(getErrorMessage(err, "Chưa thực hiện được."), "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <AdminPageSkeleton variant="table" />;

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="admin-simple-heading">
        <h1 className="m-0 font-headline-1 text-headline-1 text-on-surface">
          Quản lý người dùng
        </h1>
        <AdminRefreshButton />
        <p className="m-0 mt-space-2xs font-body-2 text-body-2 text-on-surface-variant">
          Tìm kiếm, khóa/mở khóa và phân quyền tài khoản.
        </p>
      </div>

      <Card className="p-space-lg">
        <form
          className="flex flex-wrap gap-space-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(keyword.trim());
          }}
        >
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại…"
            aria-label="Từ khóa"
            className={`${select} flex-1 min-w-[220px]`}
          />
          <select
            aria-label="Trạng thái"
            className={select}
            value={trangThai}
            onChange={(e) => {
              setTrangThai(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Mọi trạng thái</option>
            <option value="HoatDong">Hoạt động</option>
            <option value="Khoa">Đã khóa</option>
          </select>
          <select
            aria-label="Vai trò"
            className={select}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Mọi vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="User">User</option>
          </select>
          <button
            type="submit"
            className="h-11 px-space-lg rounded-xl border-0 cursor-pointer bg-primary-container hover:bg-primary text-on-primary font-button-text text-button-text"
          >
            Tìm
          </button>
        </form>
      </Card>

      {loading && <AdminPageSkeleton variant="table" />}
      {!loading && error && (
        <ErrorBox
          message={error}
          onRetry={reload}
        />
      )}
      {!loading && data && data.items.length === 0 && <Empty title="Không có người dùng phù hợp" />}

      {!loading && data && data.items.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full border-collapse font-body-2 text-body-2 text-on-surface">
            <thead>
              <tr className="text-left text-on-surface-variant font-caption-bold text-caption-bold">
                <th className="p-space-md">Người dùng</th>
                <th className="p-space-md">Vai trò</th>
                <th className="p-space-md">Tin đăng</th>
                <th className="p-space-md">Ngày tham gia</th>
                <th className="p-space-md">Trạng thái</th>
                <th className="p-space-md text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => {
                const locked = u.trangThai === "Khoa";
                const isAdminUser = u.roles.includes("Admin");
                const self = u.id === user?.idNguoiDung;
                return (
                  <tr
                    key={u.id}
                    className="border-t border-surface-variant"
                  >
                    <td className="p-space-md">
                      <div className="font-caption-bold text-caption-bold">{u.hoTen}</div>
                      <div className="text-on-surface-variant">{u.email}</div>
                      {u.soDienThoai && (
                        <div className="text-on-surface-variant">{u.soDienThoai}</div>
                      )}
                    </td>
                    <td className="p-space-md">
                      <div className="flex flex-wrap gap-space-2xs">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="px-space-sm py-space-2xs rounded-full bg-surface-container-high font-caption text-caption"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-space-md">{u.luotDang}</td>
                    <td className="p-space-md whitespace-nowrap">
                      {formatDate(u.ngayTao)}
                    </td>
                    <td className="p-space-md">
                      <span
                        className={`px-space-sm py-space-2xs rounded-full font-caption-bold text-caption-bold ${locked ? "bg-error-container text-on-error-container" : "bg-secondary-container/50 text-on-secondary-container"}`}
                      >
                        {locked ? "Đã khóa" : "Hoạt động"}
                      </span>
                      {u.khoaDen && (
                        <div className="font-caption text-caption text-on-surface-variant">
                          Khóa tạm đến {new Date(u.khoaDen).toLocaleTimeString("vi-VN")}
                        </div>
                      )}
                    </td>
                    <td className="p-space-md">
                      <div className="flex justify-end gap-space-xs">
                        {isAdmin && !isAdminUser && !self && (
                          <button
                            type="button"
                            onClick={() => setEditing(u.id)}
                            className={`${smallBtn} bg-surface-container-high hover:bg-surface-variant text-on-surface`}
                          >
                            Phân quyền
                          </button>
                        )}
                        {!isAdminUser && !self && (
                          <button
                            type="button"
                            disabled={busyId === u.id}
                            onClick={() => toggleLock(u.id, locked)}
                            className={`${smallBtn} ${locked ? "bg-primary-container text-on-primary hover:bg-primary" : "bg-error-container text-on-error-container hover:opacity-90"} disabled:opacity-60`}
                          >
                            {busyId === u.id && <span className="admin-action-spinner" aria-hidden="true" />}
                            {busyId === u.id ? "Đang cập nhật…" : locked ? "Mở khóa" : "Khóa"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {!loading && data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      )}

      <UserRolesDialog
        idNguoiDung={editing}
        onClose={() => setEditing(null)}
        onSaved={reload}
      />
    </div>
  );
}
