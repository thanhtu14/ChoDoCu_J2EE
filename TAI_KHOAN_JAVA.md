# Đăng nhập Google, mật khẩu và số điện thoại

Các API dùng Spring Security/JWT và JPA. Áp dụng `V3__google_login_va_tai_khoan_bao_mat.sql` sau V2 và sau khi đã tạo các bảng nền. Flyway đang tắt trong dev nên chạy migration thủ công một lần.

## Cấu hình

- Google: đặt `GOOGLE_CLIENT_ID` bằng Client ID Web OAuth; frontend `VITE_GOOGLE_CLIENT_ID` phải trùng.
- Email SMTP: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SMTP_AUTH`, `MAIL_SMTP_STARTTLS`, `MAIL_FROM`.
- Đường dẫn frontend nhận liên kết đặt lại mật khẩu: `PASSWORD_RESET_URL` (mặc định `http://localhost:5173/quen-mat-khau`).

Không cấu hình Google Client ID thì `/api/auth/dang-nhap-google` trả 503. Email đặt lại mật khẩu trả cùng thông báo dù email có tồn tại hay không.

## API

- `POST /api/auth/dang-nhap-google` — body `{"idToken":"..."}`; Java xác minh chữ ký, hạn dùng, audience và email đã xác minh. Email Google trùng tài khoản hiện có sẽ liên kết với tài khoản đó.
- `PUT /api/auth/doi-mat-khau` — cần Bearer token; body `{"matKhauCu":"...","matKhauMoi":"..."}`.
- `POST /api/auth/quen-mat-khau` — body `{"email":"..."}`; gửi link reset một lần, hết hạn sau 30 phút.
- `POST /api/auth/dat-lai-mat-khau` — body `{"email":"...","token":"...","matKhauMoi":"..."}`.
- `GET /api/nguoi-dung/me` — thông tin tài khoản hiện tại.
- `POST /api/nguoi-dung/me/doi-so-dien-thoai/yeu-cau` — body `{"soDienThoaiMoi":"0912345678"}`; gửi OTP email 6 số, hết hạn sau 10 phút, gửi lại sau 60 giây.
- `POST /api/nguoi-dung/me/doi-so-dien-thoai/xac-nhan` — body `{"soDienThoaiMoi":"0912345678","maXacNhan":"123456"}`; OTP chỉ dùng một lần và bị hủy sau 5 lần nhập sai.

Các mật khẩu được lưu bằng BCrypt; token xác minh lưu dưới dạng HMAC, không lưu mã/token thô. Tài khoản Google mới chưa có số điện thoại; cần hoàn thiện thông tin sau khi đăng nhập.
