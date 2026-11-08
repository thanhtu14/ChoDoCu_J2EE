# Đăng nhập và phân quyền trong backend Java

Phần phân quyền của dự án .NET đã được chuyển sang Spring Boot theo cấu trúc hiện tại:

- `entity`, `repository`, `service`, `dto`, `controller` cho tài khoản, vai trò và chức năng.
- Spring Security stateless với JWT HS256; mật khẩu được lưu bằng BCrypt.
- Mã quyền được đưa vào JWT từ các vai trò của người dùng. Endpoint quản trị quyền yêu cầu `PhanQuyen.QuanLy`.
- Vai trò mặc định: `Admin`, `Moderator`, `User`. Quyền mặc định tương ứng với `AppPermissions.DefaultByRole` từ dự án nguồn.

## Áp dụng schema

`V2__phan_quyen_va_tai_khoan.sql` bổ sung cột email/hash mật khẩu và các bảng vai trò, chức năng, liên kết. Script này cần chạy **sau khi đã tạo schema hiện có**, vì bảng `NguoiDung` phải tồn tại. Hiện Flyway đang tắt trong `application-dev.yml`; có thể chạy script bằng SSMS/sqlcmd. Không chạy script lần thứ hai trên cùng database.

## Cấu hình và API

Trong dev, JWT có khóa mặc định chỉ để chạy local. Đặt `APP_JWT_KEY` thành secret ngẫu nhiên dài ít nhất 32 byte ở môi trường dùng thật. Để tạo tài khoản Admin lần đầu, đặt `SEED_ADMIN_EMAIL` và `SEED_ADMIN_PASSWORD` (ít nhất 12 ký tự) trước khi khởi chạy; nếu không đặt, seeder không tạo tài khoản đặc quyền nào.

- `POST /api/auth/dang-ky` — tạo tài khoản User.
- `POST /api/auth/dang-nhap` — trả JWT, roles và permissions.
- `GET /api/phan-quyen/vai-tro` — xem vai trò và quyền hiện tại.
- `GET /api/phan-quyen/chuc-nang` — danh mục quyền.
- `PUT /api/phan-quyen/vai-tro/{maVaiTro}/chuc-nang` — thay toàn bộ quyền cho vai trò; body: `{"maChucNangs":["BaiDang.Tao"]}`.

Gửi token bằng `Authorization: Bearer <token>`. Với controller/action khác, dùng `@PreAuthorize("hasAuthority('PERMISSION_BaiDang.Duyet')")` hoặc `@PreAuthorize("hasRole('Admin')")`.
