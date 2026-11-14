import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon, { type IconName } from "../common/Icon";
import AdminPageSkeleton from "../admin/AdminPageSkeleton";

interface Item { to: string; label: string; icon: IconName; adminOnly?: boolean; end?: boolean; badge?: string; }
const items: Item[] = [
  { to: "/quan-tri", label: "Dashboard", icon: "grid", end: true },
  { to: "/quan-tri/duyet-bai", label: "Bài đăng", icon: "image", badge: "Mới" },
  { to: "/quan-tri/goi-dich-vu", label: "Gói dịch vụ", icon: "tag", adminOnly: true },
  { to: "/quan-tri/giao-dich-thanh-toan", label: "Giao dịch & Thanh toán", icon: "wallet", adminOnly: true },
  { to: "/quan-tri/nguoi-dung", label: "Người dùng", icon: "user", adminOnly: true },
  { to: "/quan-tri/danh-muc", label: "Danh mục", icon: "tag", adminOnly: true },
  { to: "/quan-tri/banner", label: "Banner", icon: "image", adminOnly: true },
  { to: "/quan-tri/bao-cao", label: "Báo cáo", icon: "flag", adminOnly: true, badge: "!" },
  { to: "/quan-tri/vai-tro", label: "Cài đặt", icon: "shield", adminOnly: true },
];

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenu = useRef<HTMLDetailsElement>(null);
  const [query, setQuery] = useState("");
  const [routeLoading, setRouteLoading] = useState(true);
  const [contentVersion, setContentVersion] = useState(0);
  const refreshContent = useCallback(() => {
    setContentVersion((version) => version + 1);
    setRouteLoading(true);
    window.setTimeout(() => setRouteLoading(false), 420);
  }, []);
  const visibleItems = items.filter((item) => !item.adminOnly || isAdmin);
  const skeletonVariant = location.pathname.endsWith("duyet-bai") || location.pathname.endsWith("vai-tro")
    ? "form"
    : location.pathname.endsWith("bao-cao") || location.pathname.endsWith("nguoi-dung") || location.pathname.endsWith("danh-muc") || location.pathname.endsWith("banner") || location.pathname.endsWith("giao-dich-thanh-toan") || location.pathname.endsWith("goi-dich-vu")
      ? "table"
      : "dashboard";

  useLayoutEffect(() => {
    setRouteLoading(true);
    const timer = window.setTimeout(() => setRouteLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    profileMenu.current?.removeAttribute("open");
  }, [location.pathname]);
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (profileMenu.current && !profileMenu.current.contains(event.target as Node)) profileMenu.current.removeAttribute("open");
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link to="/" className="admin-brand"><span><Icon name="tag" size={18} /></span><strong>CHỢ ĐỒ CŨ<small>ADMIN PORTAL</small></strong></Link>
        <label className="admin-search"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm theo mã tin, người đăng, SĐT, email..." /></label>
        <div className="admin-top-actions">
          <details className="admin-profile-menu" ref={profileMenu}>
            <summary className="admin-user" aria-label="Mở menu quản trị">
              <span>{user?.hoTen?.trim().charAt(0).toUpperCase() ?? "A"}</span>
              <strong>{user?.hoTen ?? "Quản trị viên"}<small>{isAdmin ? "Quản trị viên" : "Kiểm duyệt viên"}</small></strong>
              <Icon name="right" size={14} />
            </summary>
            <div className="admin-profile-dropdown">
              <div className="admin-profile-heading"><strong>{user?.hoTen ?? "Quản trị viên"}</strong><span>{isAdmin ? "Quản trị viên" : "Kiểm duyệt viên"}</span></div>
              <Link to="/quan-tri/ho-so" className="admin-profile-item"><Icon name="user" size={18} />Hồ sơ admin</Link>
              {isAdmin && <Link to="/quan-tri/nguoi-dung" className="admin-profile-item"><Icon name="plus" size={18} />Tạo tài khoản mới</Link>}
              <button type="button" className="admin-profile-item" onClick={() => { logout(); navigate("/dang-nhap-quan-tri", { replace: true }); }}><Icon name="logout" size={18} />Đăng xuất</button>
            </div>
          </details>
        </div>
      </header>
      <aside className="admin-sidebar">
        <p className="admin-sidebar-label">QUẢN TRỊ HỆ THỐNG</p>
        <nav aria-label="Quản trị">
          {visibleItems.slice(0, isAdmin ? 8 : 2).map((item) => <NavLink key={item.to + item.label} to={item.to} end={item.end} className={({ isActive }) => isActive ? "is-active" : ""}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.badge && <small>{item.badge}</small>}</NavLink>)}
        </nav>
        {isAdmin && <><p className="admin-sidebar-label admin-sidebar-subhead">CATALOG &amp; CÀI ĐẶT</p><nav aria-label="Cài đặt">{visibleItems.slice(8).map((item) => <NavLink key={item.to + item.label} to={item.to} end={item.end} className={({ isActive }) => isActive ? "is-active" : ""}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.badge && <small>{item.badge}</small>}</NavLink>)}</nav></>}
        <div className="admin-sidebar-help"><Icon name="shield" size={17} /><strong>Hướng dẫn duyệt</strong><p>Kiểm tra ảnh, liên lạc và giá bán trước khi nội dung được đăng.</p></div>
      </aside>
      <main className="admin-main" aria-busy={routeLoading}>
        {routeLoading && <div className="admin-route-skeleton" role="status"><AdminPageSkeleton variant={skeletonVariant} /></div>}
        <div key={`${location.pathname}-${contentVersion}`} className={`admin-route-content${routeLoading ? " is-loading" : ""}`}>
          <Outlet context={{ refreshContent }} />
        </div>
      </main>
      <footer className="admin-footer"><span>© 2026 Chợ Đồ Cũ Việt Nam · Hệ thống Quản trị &amp; Kiểm duyệt</span><span>Nhật ký hoạt động　 Hỗ trợ 24/7</span></footer>
    </div>
  );
}
