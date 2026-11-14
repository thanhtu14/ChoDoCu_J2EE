import { useState, type FormEvent } from "react";
import { danhMucApi } from "../../api/danhMuc";
import Icon from "../../components/common/Icon";
import { Empty, ErrorBox } from "../../components/common/State";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../utils/error";
import type { DanhMuc } from "../../types";

export default function AdminCategories() {
  useDocumentTitle("Danh mục");
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => danhMucApi.cay(), []);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    setBusy(true);
    try {
      await fn();
      toast(okMsg, "ok");
      reload();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    await run(
      () =>
        danhMucApi.tao({
          idDanhMucCha: parent ? Number(parent) : null,
          tenDanhMuc: name.trim(),
        }),
      "Đã thêm danh mục.",
    );
    setName("");
  };

  const rename = (c: DanhMuc) => {
    const next = window.prompt("Tên mới của danh mục", c.tenDanhMuc)?.trim();
    if (next && next !== c.tenDanhMuc)
      void run(
        () =>
          danhMucApi.capNhat(c.id, {
            tenDanhMuc: next,
            anhDanhMuc: c.anhDanhMuc,
            trangThai: c.trangThai,
          }),
        "Đã đổi tên.",
      );
  };
  const remove = (c: DanhMuc) => {
    if (window.confirm(`Xoá danh mục “${c.tenDanhMuc}”?`))
      void run(() => danhMucApi.xoa(c.id), "Đã xoá danh mục.");
  };

  const renderNode = (c: DanhMuc) => (
    <li
      key={c.id}
      className="node"
    >
      <div className="row">
        <strong>{c.tenDanhMuc}</strong>
        <span className="hint">#{c.id}</span>
        <button
          className="icon-btn"
          aria-label={`Đổi tên ${c.tenDanhMuc}`}
          disabled={busy}
          onClick={() => rename(c)}
        >
          {busy ? <span className="admin-action-spinner" aria-hidden="true" /> : <Icon
            name="edit"
            size={16}
          />}
        </button>
        <button
          className="icon-btn"
          aria-label={`Xoá ${c.tenDanhMuc}`}
          disabled={busy}
          onClick={() => remove(c)}
        >
          {busy ? <span className="admin-action-spinner" aria-hidden="true" /> : <Icon
            name="trash"
            size={16}
          />}
        </button>
      </div>
      {c.danhMucCons.length > 0 && <ul>{c.danhMucCons.map(renderNode)}</ul>}
    </li>
  );

  if (loading) return <AdminPageSkeleton variant="table" />;

  return (
    <div className="stack">
      <div className="admin-simple-heading"><h1>Danh mục</h1><AdminRefreshButton /></div>
      <form
        className="panel row"
        onSubmit={add}
      >
        <div className="field">
          <label htmlFor="n">Tên danh mục mới</label>
          <input
            id="n"
            required
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="p">Thuộc danh mục</label>
          <select
            id="p"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          >
            <option value="">Danh mục gốc</option>
            {(data ?? []).map((r) => (
              <option
                key={r.id}
                value={r.id}
              >
                {r.tenDanhMuc}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn"
          disabled={busy}
        >
          {busy ? <span className="admin-action-spinner" aria-hidden="true" /> : <Icon
            name="plus"
            size={16}
          />}
          {busy ? "Đang cập nhật…" : "Thêm"}
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
        <Empty title="Chưa có danh mục" />
      ) : (
        <ul className="tree panel">{data.map(renderNode)}</ul>
      )}
    </div>
  );
}
