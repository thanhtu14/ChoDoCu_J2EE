package com.company.chodocu.security;

import java.util.Set;

public final class AppPermissions {
    public static final String CLAIM = "permission";
    public static final String BAI_DANG_TAO = "BaiDang.Tao";
    public static final String BAI_DANG_DUYET = "BaiDang.Duyet";
    public static final String BAI_DANG_XOA_BAT_KY = "BaiDang.XoaBatKy";
    public static final String DANH_MUC_QUAN_LY = "DanhMuc.QuanLy";
    public static final String BANNER_QUAN_LY = "Banner.QuanLy";
    public static final String DICH_VU_QUAN_LY = "DichVu.QuanLy";
    public static final String BAO_CAO_XU_LY = "BaoCao.XuLy";
    public static final String NGUOI_DUNG_XEM = "NguoiDung.Xem";
    public static final String NGUOI_DUNG_KHOA = "NguoiDung.Khoa";
    public static final String PHAN_QUYEN_QUAN_LY = "PhanQuyen.QuanLy";
    public static final Set<String> ALL = Set.of(BAI_DANG_TAO, BAI_DANG_DUYET, BAI_DANG_XOA_BAT_KY,
            DANH_MUC_QUAN_LY, BANNER_QUAN_LY, DICH_VU_QUAN_LY, BAO_CAO_XU_LY,
            NGUOI_DUNG_XEM, NGUOI_DUNG_KHOA, PHAN_QUYEN_QUAN_LY);
    private AppPermissions() {}
}
