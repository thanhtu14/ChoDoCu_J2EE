package com.company.chodocu.dto.account;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
public record HoSoNguoiDungResponse(Integer idNguoiDung,String hoTen,String email,String soDienThoai,
 LocalDate ngaySinh,String gioiTinh,String anhNguoiDung,Integer idThanhPho,String tenThanhPho,
 Integer idPhuongXa,String tenPhuongXa,int luotDang,int luotDay,LocalDateTime ngayTao,
 String trangThai,List<String> roles) {}
