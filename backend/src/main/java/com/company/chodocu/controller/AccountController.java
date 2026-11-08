package com.company.chodocu.controller;

import com.company.chodocu.dto.account.*;
import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.service.AccountSecurityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController @RequestMapping("/api/nguoi-dung")
public class AccountController {
    private final AccountSecurityService service;
    public AccountController(AccountSecurityService service){this.service=service;}
    @GetMapping("/me") public HoSoNguoiDungResponse hoSo(@AuthenticationPrincipal String subject){return service.hoSo(id(subject));}
    @PutMapping("/me") public HoSoNguoiDungResponse capNhatHoSo(@AuthenticationPrincipal String subject,@Valid @RequestBody CapNhatHoSoRequest request){return service.capNhatHoSo(id(subject),request);}
    @PostMapping("/me/doi-so-dien-thoai/yeu-cau") public Map<String,String> yeuCau(@AuthenticationPrincipal String subject,@Valid @RequestBody YeuCauDoiSoDienThoaiRequest request){
        service.yeuCauDoiSo(id(subject),request);return Map.of("message","Đã gửi mã xác nhận tới email của bạn.");
    }
    @PostMapping("/me/doi-so-dien-thoai/xac-nhan") public HoSoNguoiDungResponse xacNhan(@AuthenticationPrincipal String subject,@Valid @RequestBody XacNhanDoiSoDienThoaiRequest request){
        NguoiDung user=service.xacNhanDoiSo(id(subject),request);
        if(user==null)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mã xác nhận không đúng hoặc đã hết hạn.");
        return service.hoSo(user.getId());
    }
    private static Integer id(String value){try{return Integer.valueOf(value);}catch(Exception ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Token không hợp lệ.");}}
}
