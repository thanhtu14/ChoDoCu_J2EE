# Hướng dẫn kết nối SQL Server + JPA (Chợ Đồ Cũ)

## 1. Khởi động SQL Server
```bash
docker compose up -d                 # chạy ở thư mục gốc (có docker-compose.yml)
docker ps                            # thấy container chodocu-db là OK
```

## 2. Tạo database và bảng (image SQL Server KHÔNG tự tạo database `chodocu`)
```bash
# tạo database
docker exec -it chodocu-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "ChoDoCuJ2EE@" -C -Q "CREATE DATABASE chodocu"

# copy script vào container rồi chạy
docker cp backend/src/main/resources/db/migration/V1__init_schema.sql chodocu-db:/tmp/init.sql
docker exec -it chodocu-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "ChoDoCuJ2EE@" -C -d chodocu -i /tmp/init.sql

# (tuỳ chọn) dữ liệu mẫu
docker cp backend/src/main/resources/db/dev-seed.sql chodocu-db:/tmp/seed.sql
docker exec -it chodocu-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "ChoDoCuJ2EE@" -C -d chodocu -f 65001 -i /tmp/seed.sql
```
Dùng SSMS / Azure Data Studio: kết nối `localhost,1433`, user `sa`, tick *Trust server certificate*, rồi chạy 2 file SQL trên.

## 3. Cấu hình (`application-dev.yml`)
| Cấu hình | Lý do |
|---|---|
| `physical-strategy: PhysicalNamingStrategyStandardImpl` | Giữ nguyên tên `NguoiDung`, `idNguoiDung`. Không có dòng này Spring đổi thành `nguoi_dung` → lỗi "Invalid object name". |
| `use_nationalized_character_data: true` | `String` → `NVARCHAR`, lưu được tiếng Việt có dấu. |
| `ddl-auto: validate` | Chỉ kiểm tra entity khớp bảng, không tự sửa DB. |
| `open-in-view: false` | Bắt buộc dùng `@Transactional` + DTO, tránh lỗi lazy ngầm. |
| `${DB_PASSWORD:...}` | Có thể ghi đè bằng biến môi trường, không commit mật khẩu thật. |

Muốn Flyway tự chạy schema: tạo DB trước, đặt `spring.flyway.enabled: true`.

## 4. Chạy và thử
```bash
cd backend
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```
- Swagger: http://localhost:8080/swagger-ui.html
- Thử API: `GET http://localhost:8080/api/danh-muc` và `GET /api/danh-muc/1/con`
- Test repository: `./mvnw test`

## 5. Cách dùng JPA để truy vấn
**a) Derived query** (Spring tự sinh SQL từ tên method; `_Id` đi vào khóa chính của quan hệ):
```java
List<PhuongXa> ds = phuongXaRepository.findByThanhPho_IdOrderByTenPhuongXaAsc(1);
```
**b) @Query (JPQL)** cho truy vấn phức tạp – xem `BaiDangRepository.timKiem`, `HoiThoaiRepository.timGiuaHaiNguoi`.

**c) Phân trang + sắp xếp:**
```java
Pageable p = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "uuTien").and(Sort.by(Sort.Direction.DESC, "ngayDang")));
Page<BaiDang> trang = baiDangRepository.timKiem(TrangThaiBaiDang.DA_DUYET, "iphone", p);
```
**d) Tránh N+1 / LazyInitializationException:** quan hệ đều `LAZY`; khi cần dữ liệu liên quan hãy
dùng `@EntityGraph` (xem `findWithDetailById`) hoặc `join fetch`, và luôn trả về **DTO** (không trả entity ra controller).

**e) Ghi dữ liệu** (trong service có `@Transactional`):
```java
@Transactional
public Integer taoThanhPho(String ten) {
    ThanhPho tp = new ThanhPho();
    tp.setTenThanhPho(ten);
    return thanhPhoRepository.save(tp).getId();   // id do SQL Server IDENTITY sinh
}
```
Quan hệ: dùng `getReferenceById(id)` để gắn khóa ngoại mà không cần SELECT:
```java
baiDang.setNguoiDang(nguoiDungRepository.getReferenceById(idNguoiDung));
```

## 6. Lỗi thường gặp
| Lỗi | Cách xử lý |
|---|---|
| `Login failed for user 'sa'` / `Cannot open database "chodocu"` | Chưa tạo DB (bước 2) hoặc sai mật khẩu. Mật khẩu SA phải đủ mạnh. |
| `PKIX path building failed` | Giữ `trustServerCertificate=true` trong URL (đã có). |
| `Invalid object name 'nguoi_dung'` | Thiếu `physical-strategy` ở mục 3. |
| `Schema-validation: wrong column type/missing column` | Chạy lại script schema, hoặc đối chiếu cột báo lỗi với entity. |
| Port 1433 bị chiếm | Dừng SQL Server cài sẵn trên máy hoặc đổi `1434:1433` trong docker-compose và URL. |
| API trả 401/403 | `SecurityConfig` hiện đang mở hết cho dev; nếu xóa file này Spring Security sẽ khóa mọi endpoint. |
