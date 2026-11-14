import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getErrorMessage } from "../../utils/error";

const highlights = [
  { icon: "monitoring", title: "Kiểm soát thời gian thực", text: "Giám sát tin đăng, tài khoản và giao dịch 24/7 tức thì." },
  { icon: "verified_user", title: "Bảo mật phân quyền", text: "Mã hóa chuẩn SSL 256-bit, RBAC phân quyền chặt chẽ từng module." },
];

export default function AdminLoginPage() {
  useDocumentTitle("Đăng nhập quản trị");
  const { user, isStaff, loginAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && !isStaff) {
      logout();
      setError("Không có quyền đăng nhập vào cổng quản trị.");
    }
  }, [user, isStaff, logout]);

  if (user) return <Navigate to="/quan-tri" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (user && !isStaff) {
        setError("Không có quyền đăng nhập vào cổng quản trị.");
        logout();
        return;
      }
      await loginAdmin({ email: email.trim(), matKhau });
      navigate("/quan-tri", { replace: true });
    } catch (err) {
      const message = getErrorMessage(err, "Không thể đăng nhập vào hệ thống quản trị.");
      setError(message.toLowerCase().includes("không có quyền") ? "Không có quyền đăng nhập vào cổng quản trị." : message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <aside className="admin-auth-brand">
          <span className="admin-auth-badge">✦ &nbsp;CỔNG QUẢN TRỊ NỘI BỘ V2.4 · BẢO MẬT & KIỂM DUYỆT 24/7</span>
          <h1>Hệ thống Quản trị &amp; Điều hành Chợ Đồ Cũ</h1>
          <p>Nền tảng kiểm duyệt nội dung, quản lý giao dịch và theo dõi toàn bộ hoạt động giao dịch TMĐT đồ cũ hàng đầu Việt Nam.</p>
          <div className="admin-auth-preview" aria-hidden="true"><div className="admin-preview-top"><b>Chợ Đồ Cũ</b><span>● Tổng quan quản trị</span></div><div className="admin-preview-body"><div className="admin-preview-side"><i /><i /><i /><i /></div><div className="admin-preview-content"><strong>Chào mừng trở lại!</strong><small>Tổng quan hệ thống hôm nay</small><div className="admin-preview-stats"><i /><i /><i /></div><div className="admin-preview-chart"><i /><i /><i /><i /><i /><i /><i /></div></div></div></div>
          <div className="admin-auth-highlights">{highlights.map((item) => <article key={item.title}><span className="material-symbols-outlined">{item.icon}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></article>)}</div>
          <div className="admin-auth-note">ⓘ &nbsp;Hệ thống chỉ dành riêng cho cán bộ quản trị và vận hành được cấp quyền truy cập chính thức.</div>
        </aside>
        <section className="admin-auth-form-wrap">
          <form className="admin-auth-form" onSubmit={submit}>
            <div className="admin-auth-eyebrow"><i /> HỆ THỐNG PHÂN QUYỀN NỘI BỘ</div>
            <h2>Đăng nhập Quản trị viên</h2>
            <p className="admin-auth-intro">Vui lòng sử dụng tài khoản nhân sự được cấp thẩm quyền để tiếp tục vào bảng điều khiển.</p>
            {error && <div className="admin-auth-error" role="alert">⚠ &nbsp;{error}</div>}
            <label htmlFor="admin-email">EMAIL QUẢN TRỊ HOẶC MÃ NHÂN VIÊN (STAFF ID) <em>*</em></label>
            <div className="admin-auth-input"><span className="material-symbols-outlined">person</span><input id="admin-email" type="email" autoComplete="username" placeholder="admin.name@chodocu.vn hoặc NV-8892" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <label htmlFor="admin-password">MẬT KHẨU BẢO MẬT <em>*</em></label>
            <div className="admin-auth-input"><span className="material-symbols-outlined">lock</span><input id="admin-password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu ít nhất 8 ký tự" required value={matKhau} onChange={(e) => setMatKhau(e.target.value)} /></div>
            <div className="admin-auth-options"><label><input type="checkbox" /> Ghi nhớ phiên đăng nhập (8 giờ)</label><Link to="/quen-mat-khau">Quên mật khẩu quản trị?</Link></div>
            <button className="admin-auth-submit" disabled={busy}>{busy ? "Đang xác thực…" : <>Đăng nhập vào Hệ thống Quản trị <span>→</span></>}</button>
            <div className="admin-auth-audit"><span className="material-symbols-outlined">warning</span><div><strong>Cảnh báo nhật ký kiểm toán (Audit Logs):</strong><p>Mọi thao tác đăng nhập và điều phối dữ liệu đều được ghi lại với IP, thiết bị và dấu thời gian thực theo tiêu chuẩn an toàn thông tin ISO/IEC 27001.</p></div></div>
            <div className="admin-auth-help">Gặp sự cố quyền truy cập hoặc quên mã nhân viên?<br />Liên hệ Đội Kỹ thuật IT Nội bộ: <a href="mailto:it-support@chodocu.vn">it-support@chodocu.vn</a> hoặc Hotline nội bộ: <b>#102</b></div>
          </form>
        </section>
      </section>
      <footer className="admin-auth-footer"><span>© 2024 Chợ Đồ Cũ Việt Nam. Hệ thống Kiểm duyệt &amp; Quản trị Sàn TMĐT thanh lý giá cao.</span><span><i /> Cluster Admin-VN-HCM01　•　<strong>v2.4.0-Admin</strong></span></footer>
    </main>
  );
}
