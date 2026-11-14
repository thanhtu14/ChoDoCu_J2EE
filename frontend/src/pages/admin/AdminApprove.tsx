import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { baiDangApi } from "../../api/baiDang";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getErrorMessage } from "../../utils/error";
import { formatPrice, TRANG_THAI_BAI_DANG } from "../../utils/format";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import type { BaiDang } from "../../types";

/** BE chưa có API "danh sách chờ duyệt", nên staff mở tin theo mã (mã có trong thông báo/URL). */
export default function AdminApprove() {
  useDocumentTitle("Duyệt bài");
  const toast = useToast();
  const [id, setId] = useState("");
  const [post, setPost] = useState<BaiDang | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState<"load" | "duyet" | "tuChoi" | null>(null);

  const load = async (e: FormEvent) => {
    e.preventDefault();
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0)
      return toast("Mã tin phải là số nguyên dương.", "error");
    setBusy(true);
    setBusyAction("load");
    try {
      setPost(await baiDangApi.chiTiet(n));
    } catch (err) {
      setPost(null);
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
      setBusyAction(null);
    }
  };

  const act = async (kind: "duyet" | "tuChoi") => {
    if (!post) return;
    setBusy(true);
    setBusyAction(kind);
    try {
      await (kind === "duyet" ? baiDangApi.duyet(post.id) : baiDangApi.tuChoi(post.id));
      toast(kind === "duyet" ? "Đã duyệt tin." : "Đã từ chối tin.", "ok");
      setPost(await baiDangApi.chiTiet(post.id));
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
      setBusyAction(null);
    }
  };

  return (
    <div className="stack">
      <div className="admin-simple-heading"><h1>Duyệt bài</h1><AdminRefreshButton /></div>
      <form
        className="row"
        onSubmit={load}
      >
        <div className="field">
          <label htmlFor="id">Mã tin đăng</label>
          <input
            id="id"
            inputMode="numeric"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <button
          className="btn"
          disabled={busy}
        >
          {busyAction === "load" && <span className="admin-action-spinner" aria-hidden="true" />}
          {busyAction === "load" ? "Đang tải tin…" : "Mở tin"}
        </button>
      </form>

      {busyAction === "load" && <AdminPageSkeleton variant="form" />}

      {post && (
        <div className="panel stack">
          <h2>{post.tieuDe}</h2>
          <p>
            <span className="price-tag">{formatPrice(post.giaTien)}</span>
          </p>
          <p className="prose">{post.noiDung}</p>
          <p className="muted">
            {post.tenNguoiDang} · {post.tenDanhMuc} · {post.diaChi}
          </p>
          <p>
            Trạng thái:{" "}
            <span className="badge">
              {TRANG_THAI_BAI_DANG[post.trangThai] ?? post.trangThai}
            </span>
          </p>
          <div className="row">
            <button
              className="btn btn-ok"
              disabled={busy}
              onClick={() => void act("duyet")}
            >
              {busyAction === "duyet" && <span className="admin-action-spinner" aria-hidden="true" />}
              {busyAction === "duyet" ? "Đang duyệt…" : "Duyệt"}
            </button>
            <button
              className="btn btn-danger"
              disabled={busy}
              onClick={() => void act("tuChoi")}
            >
              {busyAction === "tuChoi" && <span className="admin-action-spinner" aria-hidden="true" />}
              {busyAction === "tuChoi" ? "Đang từ chối…" : "Từ chối"}
            </button>
            <Link
              to={`/bai-dang/${post.id}`}
              className="btn btn-ghost"
            >
              Xem trang tin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
