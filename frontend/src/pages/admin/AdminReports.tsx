import { useState } from "react";
import { Link } from "react-router-dom";
import { baoCaoApi } from "../../api/baoCao";
import Pagination from "../../components/common/Pagination";
import { Empty, ErrorBox } from "../../components/common/State";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../utils/error";
import { formatDateTime } from "../../utils/format";

const FILTERS = [
  { value: "", label: "Tất cả" },
  { value: "ChoXuLy", label: "Chờ xử lý" },
  { value: "DaXuLy", label: "Đã xử lý" },
  { value: "BoQua", label: "Bỏ qua" },
];

export default function AdminReports() {
  useDocumentTitle("Báo cáo vi phạm");
  const toast = useToast();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<number | null>(null);
  const { data, loading, error, reload } = useFetch(
    () => baoCaoApi.danhSach(status || undefined, page, 15),
    [status, page],
  );

  const handle = async (id: number, to: "DaXuLy" | "BoQua") => {
    setBusyId(id);
    try {
      await baoCaoApi.xuLy(id, to);
      toast("Đã cập nhật báo cáo.", "ok");
      reload();
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <AdminPageSkeleton variant="table" />;

  return (
    <div className="stack">
      <div className="admin-simple-heading"><h1>Báo cáo vi phạm</h1><AdminRefreshButton /></div>
      <div
        className="field"
        style={{ maxWidth: 220 }}
      >
        <label htmlFor="st">Trạng thái</label>
        <select
          id="st"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {FILTERS.map((f) => (
            <option
              key={f.value}
              value={f.value}
            >
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <AdminPageSkeleton variant="table" />
      ) : error ? (
        <ErrorBox
          message={error}
          onRetry={reload}
        />
      ) : !data || data.items.length === 0 ? (
        <Empty title="Không có báo cáo nào" />
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tin đăng</th>
                  <th>Người báo cáo</th>
                  <th>Nội dung</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/bai-dang/${r.idBaiDang}`}>{r.tieuDeBaiDang}</Link>
                    </td>
                    <td>{r.tenNguoiBaoCao}</td>
                    <td>{r.noiDung}</td>
                    <td>{formatDateTime(r.ngayTao)}</td>
                    <td>
                      <span className="badge">{r.trangThai}</span>
                    </td>
                    <td className="row">
                      <button
                        className="btn btn-ok btn-sm"
                        disabled={busyId === r.id}
                        onClick={() => void handle(r.id, "DaXuLy")}
                      >
                        {busyId === r.id && <span className="admin-action-spinner" aria-hidden="true" />}
                        {busyId === r.id ? "Đang lưu…" : "Đã xử lý"}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={busyId === r.id}
                        onClick={() => void handle(r.id, "BoQua")}
                      >
                        {busyId === r.id ? "Đang lưu…" : "Bỏ qua"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
