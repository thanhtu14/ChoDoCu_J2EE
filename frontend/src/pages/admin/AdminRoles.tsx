import { useEffect, useState } from "react";
import { phanQuyenApi } from "../../api/quanTri";
import PermissionPicker from "../../components/admin/PermissionPicker";
import { Card, TextInput } from "../../components/account/FormControls";
import FormAlert from "../../components/auth/FormAlert";
import { ErrorBox, Spinner } from "../../components/common/State";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import type { VaiTroItem } from "../../types";
import { getErrorMessage } from "../../utils/error";

type Selected = number | "new" | null;

/** Quản lý vai trò: tạo vai trò mới, chọn quyền cho từng vai trò. */
export default function AdminRoles() {
  useDocumentTitle("Phân quyền");
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(async () => {
    const [vaiTro, quyen] = await Promise.all([phanQuyenApi.vaiTro(), phanQuyenApi.quyen()]);
    return { vaiTro, quyen };
  }, []);

  const [selected, setSelected] = useState<Selected>(null);
  const [ten, setTen] = useState("");
  const [quyen, setQuyen] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const current: VaiTroItem | undefined = typeof selected === "number" ? data?.vaiTro.find((v) => v.id === selected) : undefined;

  // Chọn vai trò đầu tiên khi tải xong.
  useEffect(() => {
    if (data && selected === null && data.vaiTro.length) setSelected(data.vaiTro[0].id);
  }, [data, selected]);

  useEffect(() => {
    setErr("");
    if (selected === "new") {
      setTen("");
      setQuyen([]);
    } else if (current) {
      setTen(current.ten);
      setQuyen(current.quyen);
    }
  }, [selected, current?.id, current?.quyen.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const locked = current?.ten === "Admin"; // Admin luôn đủ quyền, không chỉnh để tránh tự cắt quyền

  const save = async () => {
    setErr("");
    setBusy(true);
    try {
      if (selected === "new") {
        const created = await phanQuyenApi.taoVaiTro({ ten: ten.trim(), quyen });
        toast("Đã tạo vai trò.", "ok");
        setSelected(created.id);
      } else if (current) {
        await phanQuyenApi.capNhatVaiTro(current.id, { ten: current.laHeThong ? undefined : ten.trim(), quyen });
        toast("Đã lưu vai trò. Quyền mới áp dụng khi người dùng đăng nhập lại.", "ok");
      }
      reload();
    } catch (e) {
      setErr(getErrorMessage(e, "Chưa lưu được vai trò."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!current || !window.confirm(`Xóa vai trò "${current.ten}"?`)) return;
    try {
      await phanQuyenApi.xoaVaiTro(current.id);
      toast("Đã xóa vai trò.", "ok");
      setSelected(null);
      reload();
    } catch (e) {
      setErr(getErrorMessage(e, "Chưa xóa được vai trò."));
    }
  };

  return (
    <div className="flex flex-col gap-space-lg">
      <div>
        <h1 className="m-0 font-headline-1 text-headline-1 text-on-surface">Phân quyền</h1>
        <p className="m-0 mt-space-2xs font-body-2 text-body-2 text-on-surface-variant">
          Tạo vai trò và chọn quyền cho từng vai trò. Để cấp vai trò hoặc quyền riêng cho một người, vào Người dùng → Phân quyền.
        </p>
      </div>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-space-lg items-start">
          <Card className="p-space-sm flex flex-col gap-space-2xs">
            {data.vaiTro.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected(v.id)}
                className={`w-full text-left px-space-md py-space-sm rounded-lg border-0 cursor-pointer font-body-2 text-body-2 ${selected === v.id ? "bg-primary-container text-on-primary" : "bg-transparent text-on-surface hover:bg-surface-container-low"}`}
              >
                <div className="font-caption-bold text-caption-bold">{v.ten}</div>
                <div className="font-caption text-caption opacity-80">{v.soNguoiDung} người · {v.quyen.length} quyền</div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelected("new")}
              className={`w-full text-left px-space-md py-space-sm rounded-lg border-0 cursor-pointer font-caption-bold text-caption-bold ${selected === "new" ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-primary hover:bg-surface-container-high"}`}
            >
              + Vai trò mới
            </button>
          </Card>

          {(selected === "new" || current) && (
            <Card className="p-space-xl flex flex-col gap-space-lg">
              <TextInput id="ten-vai-tro" label="Tên vai trò" required value={ten} onChange={(e) => setTen(e.target.value)} readOnly={current?.laHeThong} hint={current?.laHeThong ? "Vai trò hệ thống, không đổi tên hoặc xóa được." : undefined} />
              {locked && <FormAlert message="Admin luôn có đầy đủ quyền, không thể chỉnh sửa." />}
              <PermissionPicker quyen={data.quyen} selected={quyen} onChange={setQuyen} disabled={locked} />
              {err && <FormAlert message={err} />}
              <div className="flex justify-between gap-space-sm">
                <div>
                  {current && !current.laHeThong && (
                    <button type="button" onClick={remove} className="h-11 px-space-lg rounded-xl border-0 cursor-pointer bg-error-container text-on-error-container font-button-text text-button-text">Xóa vai trò</button>
                  )}
                </div>
                <button type="button" onClick={save} disabled={busy || locked} className="h-11 px-space-lg rounded-xl border-0 cursor-pointer bg-primary-container hover:bg-primary text-on-primary font-button-text text-button-text disabled:opacity-70 disabled:cursor-not-allowed">
                  {busy ? "Đang lưu…" : selected === "new" ? "Tạo vai trò" : "Lưu thay đổi"}
                </button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
