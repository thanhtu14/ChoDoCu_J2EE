-- Requires the base NguoiDung table created by the project's current SQL schema.
ALTER TABLE NguoiDung ADD Email NVARCHAR(254) NULL, MatKhauHash NVARCHAR(100) NULL;
CREATE UNIQUE INDEX UX_NguoiDung_Email ON NguoiDung(Email) WHERE Email IS NOT NULL;

CREATE TABLE VaiTro (
  idVaiTro INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_VaiTro PRIMARY KEY,
  MaVaiTro NVARCHAR(50) NOT NULL CONSTRAINT UQ_VaiTro_Ma UNIQUE,
  TenVaiTro NVARCHAR(100) NOT NULL
);
CREATE TABLE ChucNang (
  idChucNang INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ChucNang PRIMARY KEY,
  MaChucNang NVARCHAR(100) NOT NULL CONSTRAINT UQ_ChucNang_Ma UNIQUE,
  TenChucNang NVARCHAR(150) NOT NULL
);
CREATE TABLE NguoiDung_VaiTro (
  idNguoiDung INT NOT NULL,
  idVaiTro INT NOT NULL,
  CONSTRAINT PK_NguoiDung_VaiTro PRIMARY KEY(idNguoiDung,idVaiTro),
  CONSTRAINT FK_NDVT_NguoiDung FOREIGN KEY(idNguoiDung) REFERENCES NguoiDung(idNguoiDung),
  CONSTRAINT FK_NDVT_VaiTro FOREIGN KEY(idVaiTro) REFERENCES VaiTro(idVaiTro)
);
CREATE TABLE VaiTro_ChucNang (
  idVaiTro INT NOT NULL,
  idChucNang INT NOT NULL,
  CONSTRAINT PK_VaiTro_ChucNang PRIMARY KEY(idVaiTro,idChucNang),
  CONSTRAINT FK_VTCN_VaiTro FOREIGN KEY(idVaiTro) REFERENCES VaiTro(idVaiTro),
  CONSTRAINT FK_VTCN_ChucNang FOREIGN KEY(idChucNang) REFERENCES ChucNang(idChucNang)
);

INSERT VaiTro(MaVaiTro,TenVaiTro) VALUES ('Admin',N'Quản trị viên'),('Moderator',N'Điều hành viên'),('User',N'Người dùng');
INSERT ChucNang(MaChucNang,TenChucNang) VALUES
('BaiDang.Tao',N'Đăng bài'),('BaiDang.Duyet',N'Duyệt / từ chối bài đăng'),('BaiDang.XoaBatKy',N'Xóa bài đăng của bất kỳ ai'),
('DanhMuc.QuanLy',N'Quản lý danh mục'),('Banner.QuanLy',N'Quản lý banner'),('DichVu.QuanLy',N'Quản lý dịch vụ'),
('BaoCao.XuLy',N'Xử lý báo cáo vi phạm'),('NguoiDung.Xem',N'Xem danh sách người dùng'),('NguoiDung.Khoa',N'Khóa / mở khóa người dùng'),('PhanQuyen.QuanLy',N'Quản lý vai trò và phân quyền');
INSERT VaiTro_ChucNang(idVaiTro,idChucNang)
SELECT r.idVaiTro,p.idChucNang FROM VaiTro r CROSS JOIN ChucNang p WHERE r.MaVaiTro='Admin';
INSERT VaiTro_ChucNang(idVaiTro,idChucNang)
SELECT r.idVaiTro,p.idChucNang FROM VaiTro r JOIN ChucNang p ON p.MaChucNang IN ('BaiDang.Tao','BaiDang.Duyet','BaiDang.XoaBatKy','BaoCao.XuLy','NguoiDung.Xem') WHERE r.MaVaiTro='Moderator';
INSERT VaiTro_ChucNang(idVaiTro,idChucNang)
SELECT r.idVaiTro,p.idChucNang FROM VaiTro r JOIN ChucNang p ON p.MaChucNang='BaiDang.Tao' WHERE r.MaVaiTro='User';
