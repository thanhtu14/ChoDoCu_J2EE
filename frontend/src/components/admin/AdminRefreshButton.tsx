import { useOutletContext } from "react-router-dom";
import Icon from "../common/Icon";

interface AdminOutletContext { refreshContent: () => void }

export default function AdminRefreshButton() {
  const { refreshContent } = useOutletContext<AdminOutletContext>();
  return <button type="button" className="admin-content-refresh" onClick={refreshContent} aria-label="Làm mới dữ liệu chức năng hiện tại" title="Làm mới dữ liệu">
    <Icon name="refresh" size={17} /><span>Làm mới dữ liệu</span>
  </button>;
}
