import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

/** Khung chung của mọi trang: Header + nội dung + Footer. Nội dung tự quyết bề rộng (xem ContainerLayout, AuthLayout). */
export default function Layout() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith("/quan-tri");
  const isAdminLogin = pathname === "/dang-nhap-quan-tri";

  // Cuộn lên đầu khi đổi trang (đổi query như phân trang thì giữ nguyên vị trí).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-1 text-on-surface antialiased">
      {!isAdminPage && !isAdminLogin && <Header />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      {!isAdminPage && !isAdminLogin && <Footer />}
    </div>
  );
}
