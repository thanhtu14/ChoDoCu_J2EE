import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { phanQuyenApi } from "../../api/quanTri";
import { useToast } from "../../contexts/ToastContext";
import { getErrorMessage } from "../../utils/error";
import FormAlert from "../auth/FormAlert";
import { ErrorBox, Spinner } from "../common/State";
import MaterialIcon from "../common/MaterialIcon";
import { useFetch } from "../../hooks/useFetch";
import PermissionPicker from "./PermissionPicker";

interface Props {
  idNguoiDung: number | null;
  onClose: () => void;
  onSaved: () => void;
}

/** Gán vai trò và quyền riêng cho một người dùng. */
export default function UserRolesDialog({ idNguoiDung, onClose, onSaved }: Props) {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(async () => {
    if (idNguoiDung == null) return null;
    const [nd, vaiTro, quyen] = await Promise.all([phanQuyenApi.nguoiDung(idNguoiDung), phanQuyenApi.vaiTro(), phanQuyenApi.quyen()]);
    return { nd, vaiTro, quyen };
  }, [idNguoiDung]);

  const [roles, setRoles] = useState<string[]>([]);
  const [rieng, setRieng] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) {
      setRoles(data.nd.vaiTro);
      setRieng(data.nd.quyenRieng);
      setErr("");
    }
  }, [data]);

  useEffect(() => {
    if (idNguoiDung == null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idNguoiDung, onClose]);

  if (idNguoiDung == null) return null;

  const laAdmin = data?.nd.vaiTro.includes("Admin");
  const quyenTuVaiTro = data
    ? Array.from(new Set(data.vaiTro.filter((v) => roles.includes(v.ten)).flatMap((v) => v.quyen)))
    : [];

  const save = async () => {
    setErr("");
    setBusy(true);
    try {
      await phanQuyenApi.capNhatNguoiDung(idNguoiDung, { vaiTro: roles, quyenRieng: rieng });
      toast("Đã cập nhật phân quyền. Người dùng cần đăng nhập lại để áp dụng.", "ok");
      onSaved();
      onClose();
    } catch (e) {
      setErr(getErrorMessage(e, "Chưa lưu được phân quyền."));
    } finally {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-space-md bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="pq-title" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-container-lowest p-space-xl shadow-xl flex flex-col gap-space-lg">
        <div className="flex items-start justify-between gap-space-md">
          <div>
            <h2 id="pq-title" className="m-0 font-headline-2 text-headline-2 text-on-surface">Phân quyền người dùng</h2>
            {data && <p className="m-0 mt-space-2xs font-body-2 text-body-2 text-on-surface-variant">{data.nd.hoTen} · {data.nd.email}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="border-0 bg-transparent cursor-pointer text-on-surface-variant hover:text-on-surface">
            <MaterialIcon name="close" size={22} />
          </button>
        </div>

        {loading && <Spinner />}
        {error && <ErrorBox message={error} onRetry={reload} />}

        {data && (
          <>
            {laAdmin && <FormAlert message="Đây là tài khoản Admin, không thể thay đổi phân quyền qua giao diện." />}

            <section className="flex flex-col gap-space-sm">
              <h3 className="m-0 font-headline-3 text-headline-3 text-on-surface">Vai trò</h3>
              <div className="flex flex-wrap gap-space-sm">
                {data.vaiTro
                  .filter((v) => v.ten !== "Admin")
                  .map((v) => {
                    const on = roles.includes(v.ten);
                    return (
                      <label key={v.id} className={`px-space-md py-space-xs rounded-full cursor-pointer font-caption-bold text-caption-bold ${on ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface"}`}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          disabled={laAdmin}
                          checked={on}
                          onChange={() => setRoles(on ? roles.filter((x) => x !== v.ten) : [...roles, v.ten])}
                        />
                        {v.ten}
                      </label>
                    );
                  })}
              </div>
              <p className="m-0 font-caption text-caption text-on-surface-variant">Nếu bỏ hết vai trò, tài khoản sẽ về lại vai trò User.</p>
            </section>

            <section className="flex flex-col gap-space-sm">
              <h3 className="m-0 font-headline-3 text-headline-3 text-on-surface">Quyền riêng</h3>
              <p className="m-0 font-caption text-caption text-on-surface-variant">Cấp thêm quyền cho riêng người này, ngoài quyền có sẵn từ vai trò.</p>
              <PermissionPicker quyen={data.quyen} selected={rieng} inherited={quyenTuVaiTro} onChange={setRieng} disabled={laAdmin} />
            </section>

            {err && <FormAlert message={err} />}

            <div className="flex justify-end gap-space-sm">
              <button type="button" onClick={onClose} className="h-11 px-space-lg rounded-xl border-0 cursor-pointer bg-surface-container-high hover:bg-surface-variant font-button-text text-button-text text-on-surface">Hủy</button>
              <button type="button" onClick={save} disabled={busy || laAdmin} className="h-11 px-space-lg rounded-xl border-0 cursor-pointer bg-primary-container hover:bg-primary text-on-primary font-button-text text-button-text disabled:opacity-70 disabled:cursor-not-allowed">
                {busy ? "Đang lưu…" : "Lưu phân quyền"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
