package com.company.chodocu.mapper;

import com.company.chodocu.dto.account.HoSoNguoiDungResponse;
import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.entity.VaiTro;
import org.springframework.stereotype.Component;

import java.util.Comparator;

@Component
public class NguoiDungMapper {
    public HoSoNguoiDungResponse toHoSo(NguoiDung user) {
        return new HoSoNguoiDungResponse(
                user.getId(),
                user.getHoTen(),
                user.getEmail() == null ? "" : user.getEmail(),
                user.getSoDienThoai(),
                user.getNgaySinh(),
                user.getGioiTinh(),
                user.getAnhNguoiDung(),
                user.getThanhPho() == null ? null : user.getThanhPho().getId(),
                user.getThanhPho() == null ? null : user.getThanhPho().getTenThanhPho(),
                user.getPhuongXa() == null ? null : user.getPhuongXa().getId(),
                user.getPhuongXa() == null ? null : user.getPhuongXa().getTenPhuongXa(),
                user.getLuotDang(),
                user.getLuotDay(),
                user.getNgayTao(),
                user.getTrangThai().name(),
                user.getVaiTros().stream().map(VaiTro::getMaVaiTro).sorted(Comparator.naturalOrder()).toList());
    }
}
