# Chợ Đồ Cũ – Frontend

Giao diện React, TypeScript và Vite. Dev server proxy API sang Spring Boot trong thư mục `backend`.

## Chạy local

1. Khởi động SQL Server từ thư mục gốc bằng `docker compose up -d db`.
2. Khởi động backend trong `backend` bằng `mvn spring-boot:run` (hoặc chạy JAR đã build).
3. Trong `frontend`, chạy `npm ci` một lần, sau đó `npm run dev`.
4. Mở http://localhost:5173.

Vite mặc định chuyển tiếp `/api` và `/uploads` đến `http://localhost:8080`. Có thể ghi đè bằng `VITE_PROXY_TARGET` trong file `.env` cục bộ; `.env.example` là mẫu cấu hình. Nếu đổi domain khi deploy, đặt `VITE_API_URL` thành URL API đầy đủ, ví dụ `https://api.example.com/api`.

## Build

Chạy `npm run build` để kiểm tra TypeScript và tạo bản production trong `dist`.

## Lưu ý API

Các trang và component được giữ theo giao diện trong frontend .NET đính kèm. Backend Java hiện chưa triển khai tất cả endpoint của frontend, đặc biệt các luồng bài đăng, thanh toán, lịch sử tìm kiếm và một số API quản trị. Những màn hình gọi endpoint chưa có sẽ cần port API tương ứng trong backend để dùng đầy đủ.

## Cấu trúc
- `src/api` – mỗi file một nhóm endpoint, dùng chung `client.ts` (gắn Bearer token, báo hết phiên khi 401).
- `src/types` – kiểu DTO khớp backend.
- `src/contexts` – Toast, Auth, Favorites, Notification.
- `src/pages` – home, post, auth, account, chat, service, admin.
- `src/components/layout` – khung trang, mỗi phần một file:
  `Layout` (Header + nội dung + Footer) · `Header` gồm `Logo`, `SearchBar` (chọn thành phố + từ khoá), `HeaderNav`,
  `PostAdButton`, `UserMenu` và `Breadcrumbs` · `Footer` · `ContainerLayout` (khung rộng cho trang thường) · `AdminLayout`.
- `src/components/auth` – trang đăng nhập/đăng ký tách thành: `AuthLayout` (khung hai cột), `AuthShowcase` (cột trái quảng bá),
  `AuthFormHeader`, `AuthField`/`AuthSelect`, `SubmitButton`, `FormAlert`, `AuthSwitchPrompt`.
  `pages/auth/LoginPage` và `RegisterPage` chỉ còn phần form và gọi API.
- `src/index.css` – CSS cho các trang nội dung (tem giá, lưới tin, chat, quản trị…), đã đổi sang tông cam của thiết kế.
- `tailwind.config.js` – màu/khoảng cách/cỡ chữ lấy từ thiết kế. Tailwind dùng cho Header, Footer và khối auth;
  `preflight` và `container` tắt để không làm vỡ `index.css`.
- Icon dùng Material Symbols (nạp từ Google Fonts trong `index.html`, cần internet).

Route: `Layout` → `AuthLayout` (/dang-nhap, /dang-ky) và `ContainerLayout` (các trang còn lại), xem `src/App.tsx`.

## Giới hạn hiện tại (do backend chưa có endpoint)
- Đăng nhập chỉ bằng email (BE chưa hỗ trợ SĐT). Chưa có "Quên mật khẩu", "Ghi nhớ đăng nhập", đăng nhập Google/Facebook nên các phần này không đưa vào form.
- Chưa có API upload ảnh: người đăng dán URL ảnh (1–10 ảnh).
- Chưa có API danh sách tin chờ duyệt: trang "Duyệt bài" mở tin theo mã; staff cũng duyệt được ngay ở trang chi tiết.
- Lọc danh mục chỉ theo danh mục con (lá).
- Nút "giả lập thanh toán" chỉ để thử nghiệm; bản thật phải do cổng thanh toán báo về backend.
- Tin nhắn cập nhật bằng polling 5 giây (chưa dùng SignalR).
