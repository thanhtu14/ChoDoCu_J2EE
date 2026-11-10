package com.company.chodocu.controller;
import com.company.chodocu.dto.auth.*;
import com.company.chodocu.service.AuthService;
import com.company.chodocu.service.AccountSecurityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    private final AccountSecurityService accountSecurity;
    public AuthController(AuthService auth,AccountSecurityService accountSecurity){this.auth=auth;this.accountSecurity=accountSecurity;}
    @PostMapping("/dang-ky") public AuthResponse dangKy(@Valid @RequestBody DangKyRequest request){return auth.dangKy(request);}
    @PostMapping("/dang-nhap") public AuthResponse dangNhap(@Valid @RequestBody DangNhapRequest request){return auth.dangNhap(request);}
    @PostMapping("/dang-nhap-google") public AuthResponse dangNhapGoogle(@Valid @RequestBody DangNhapGoogleRequest request){return auth.dangNhapGoogle(request);}
    @PutMapping("/doi-mat-khau") @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.NO_CONTENT)
    public void doiMatKhau(@AuthenticationPrincipal String userId,@Valid @RequestBody DoiMatKhauRequest request){accountSecurity.doiMatKhau(id(userId),request);}
    @PostMapping("/quen-mat-khau") public java.util.Map<String,String> quenMatKhau(@Valid @RequestBody QuenMatKhauRequest request){accountSecurity.quenMatKhau(request);return java.util.Map.of("message","Nếu email thuộc một tài khoản, liên kết đặt lại mật khẩu sẽ được gửi.");}
    @PostMapping("/dat-lai-mat-khau") @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.NO_CONTENT)
    public void datLaiMatKhau(@Valid @RequestBody DatLaiMatKhauRequest request){accountSecurity.datLaiMatKhau(request);}
    private static Integer id(String value){try{return Integer.valueOf(value);}catch(Exception ex){throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Token không hợp lệ.");}}
}
