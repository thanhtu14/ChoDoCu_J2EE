import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Chặn trang cần đăng nhập; truyền roles để chỉ cho đúng vai trò vào. */
export default function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user, isStaff } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/quan-tri");

  if (!user)
    return (
      <Navigate
        to={isAdminRoute ? "/dang-nhap-quan-tri" : "/dang-nhap"}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  if (roles && !roles.includes(user.role))
    return (
      <Navigate
        to="/"
        replace
      />
    );
  if (!roles && isStaff) return <Navigate to="/quan-tri" replace />;
  return <Outlet />;
}
