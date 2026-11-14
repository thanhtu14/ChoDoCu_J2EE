import { useState, type FormEvent } from "react";
import { bannerApi } from "../../api/banner";
import Icon from "../../components/common/Icon";
import { Empty, ErrorBox } from "../../components/common/State";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../utils/error";
import { imgSrc, onImgError } from "../../utils/image";

export default function AdminBanners() {
  useDocumentTitle("Banner");
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => bannerApi.danhSach(), []);
  const [url, setUrl] = useState("");
  const [pos, setPos] = useState("");
  const [busy, setBusy] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await bannerApi.tao({ hinhAnh: url.trim(), viTri: pos.trim() || null });
      toast("Đã thêm banner.", "ok");
      setUrl("");
      setPos("");
      reload();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Xoá banner này?")) return;
    setRemovingId(id);
    try {
      await bannerApi.xoa(id);
      toast("Đã xoá banner.", "ok");
      reload();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <AdminPageSkeleton variant="table" />;

  return (
    <div className="stack">
      <div className="admin-simple-heading"><h1>Banner</h1><AdminRefreshButton /></div>
      <form
        className="panel row"
        onSubmit={add}
      >
        <div
          className="field"
          style={{ flex: 1 }}
        >
          <label htmlFor="u">Đường dẫn ảnh</label>
          <input
            id="u"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/banner.jpg"
          />
        </div>
        <div className="field">
          <label htmlFor="v">Vị trí</label>
          <input
            id="v"
            value={pos}
            onChange={(e) => setPos(e.target.value)}
            placeholder="TrangChu"
          />
        </div>
        <button
          className="btn"
          disabled={busy}
        >
          {busy ? <span className="admin-action-spinner" aria-hidden="true" /> : <Icon
            name="plus"
            size={16}
          />}
          {busy ? "Đang thêm…" : "Thêm"}
        </button>
      </form>

      {loading ? (
        <AdminPageSkeleton variant="table" />
      ) : error ? (
        <ErrorBox
          message={error}
          onRetry={reload}
        />
      ) : !data || data.length === 0 ? (
        <Empty title="Chưa có banner" />
      ) : (
        <div className="img-list">
          {data.map((b) => (
            <div
              key={b.id}
              className="img-row"
            >
              <img
                src={imgSrc(b.hinhAnh)}
                alt=""
                onError={onImgError}
              />
              <span>{b.viTri ?? "—"}</span>
              <button
                className="icon-btn"
                aria-label={`Xoá banner ${b.id}`}
                disabled={removingId === b.id}
                onClick={() => void remove(b.id)}
              >
                {removingId === b.id ? <span className="admin-action-spinner" aria-hidden="true" /> : <Icon
                  name="trash"
                  size={18}
                />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
