package com.company.chodocu.service;

import com.company.chodocu.dto.auth.*;
import com.company.chodocu.entity.*;
import com.company.chodocu.enums.TrangThaiNguoiDung;
import com.company.chodocu.repository.*;
import com.company.chodocu.security.AppRoles;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuthService {
    private final NguoiDungRepository users;
    private final VaiTroRepository roles;
    private final GoogleTokenVerifier google;
    private final PasswordEncoder encoder;
    private final String key, issuer, audience;
    private final long expireMinutes;

    public AuthService(NguoiDungRepository users, VaiTroRepository roles, GoogleTokenVerifier google, PasswordEncoder encoder,
       @Value("${app.jwt.key}") String key, @Value("${app.jwt.issuer:ChoDoCu}") String issuer,
       @Value("${app.jwt.audience:ChoDoCu.Client}") String audience, @Value("${app.jwt.expire-minutes:120}") long expireMinutes) {
        if (key.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("app.jwt.key phải dài ít nhất 32 byte");
        this.users=users; this.roles=roles; this.google=google; this.encoder=encoder; this.key=key; this.issuer=issuer; this.audience=audience; this.expireMinutes=expireMinutes;
    }

    @Transactional
    public AuthResponse dangKy(DangKyRequest r) {
        String email=r.email().trim().toLowerCase(Locale.ROOT);
        if(users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email đã được sử dụng.");
        if(users.existsBySoDienThoai(r.soDienThoai().trim())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Số điện thoại đã được sử dụng.");
        VaiTro userRole=roles.findByMaVaiTro(AppRoles.USER).orElseThrow(() -> new IllegalStateException("Thiếu role User; hãy áp dụng migration phân quyền."));
        NguoiDung u=new NguoiDung(); u.setEmail(email); u.setMatKhauHash(encoder.encode(r.matKhau())); u.setHoTen(r.hoTen().trim());
        u.setSoDienThoai(r.soDienThoai().trim()); u.setNgaySinh(r.ngaySinh()); u.setGioiTinh(r.gioiTinh().trim());
        u.setTrangThai(TrangThaiNguoiDung.HOAT_DONG); u.setNgayTao(LocalDateTime.now()); u.getVaiTros().add(userRole);
        return taoResponse(users.save(u));
    }

    @Transactional(readOnly=true)
    public AuthResponse dangNhap(DangNhapRequest r) {
        NguoiDung u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng."));
        if(u.getMatKhauHash()==null || !encoder.matches(r.matKhau(),u.getMatKhauHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng.");
        if(u.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản đã bị khóa.");
        return taoResponse(u);
    }

    @Transactional(readOnly=true)
    public AuthResponse dangNhapClient(DangNhapRequest r) {
        NguoiDung u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng."));
        if(u.getMatKhauHash()==null || !encoder.matches(r.matKhau(),u.getMatKhauHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng.");
        if(u.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản đã bị khóa.");
        boolean client=u.getVaiTros().stream().anyMatch(role -> AppRoles.USER.equals(role.getMaVaiTro()));
        boolean staff=u.getVaiTros().stream().anyMatch(role -> AppRoles.ADMIN.equals(role.getMaVaiTro()) || AppRoles.MODERATOR.equals(role.getMaVaiTro()));
        if(!client || staff) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Bạn không thể đăng nhập bằng tài khoản quản trị. Vui lòng dùng cổng quản trị.");
        return taoResponse(u);
    }

    @Transactional(readOnly=true)
    public AuthResponse dangNhapQuanTri(DangNhapRequest r) {
        NguoiDung u=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng."));
        if(u.getMatKhauHash()==null || !encoder.matches(r.matKhau(),u.getMatKhauHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Email hoặc mật khẩu không đúng.");
        if(u.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản đã bị khóa.");
        boolean staff=u.getVaiTros().stream().anyMatch(role -> AppRoles.ADMIN.equals(role.getMaVaiTro()) || AppRoles.MODERATOR.equals(role.getMaVaiTro()));
        if(!staff) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản này không có quyền truy cập cổng quản trị.");
        return taoResponse(u);
    }

    @Transactional
    public AuthResponse dangNhapGoogle(DangNhapGoogleRequest request) {
        GoogleTokenVerifier.GoogleUser info=google.xacThuc(request.idToken());
        if(info==null||!info.emailVerified()||info.email()==null||info.email().isBlank()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Không xác thực được tài khoản Google.");
        String email=info.email().trim().toLowerCase(Locale.ROOT);
        NguoiDung u=users.findByGoogleSubject(info.subject()).orElse(null);
        if(u==null) {
            u=users.findByEmailIgnoreCase(email).orElse(null);
            if(u==null) {
                VaiTro userRole=roles.findByMaVaiTro(AppRoles.USER).orElseThrow(()->new IllegalStateException("Thiếu role User; hãy áp dụng migration phân quyền."));
                u=new NguoiDung();u.setEmail(email);u.setHoTen(info.name()==null||info.name().isBlank()?email.substring(0,email.indexOf('@')):info.name().trim());
                u.setSoDienThoai("");u.setNgaySinh(java.time.LocalDate.of(1900,1,1));u.setGioiTinh("Khác");
                u.setTrangThai(TrangThaiNguoiDung.HOAT_DONG);u.setNgayTao(LocalDateTime.now());u.getVaiTros().add(userRole);
                if(info.picture()!=null&&info.picture().length()<=255)u.setAnhNguoiDung(info.picture());
            }
            if(u.getGoogleSubject()!=null&&!u.getGoogleSubject().equals(info.subject())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email này đã liên kết với tài khoản Google khác.");
            u.setGoogleSubject(info.subject());u=users.save(u);
        }
        if(u.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản đã bị khóa.");
        return taoResponse(u);
    }

    private AuthResponse taoResponse(NguoiDung u) {
        List<String> roleNames=u.getVaiTros().stream().map(VaiTro::getMaVaiTro).sorted().toList();
        List<String> permissions=u.getVaiTros().stream().flatMap(r->r.getChucNangs().stream()).map(ChucNang::getMaChucNang).distinct().sorted().toList();
        Instant expires=Instant.now().plusSeconds(expireMinutes*60);
        String token=Jwts.builder().issuer(issuer).audience().add(audience).and().subject(u.getId().toString()).claim("name",u.getHoTen())
           .claim("email",u.getEmail()).claim("roles",roleNames).claim("permissions",permissions).issuedAt(new Date()).expiration(Date.from(expires))
           .signWith(Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8))).compact();
        return new AuthResponse(token,expires,u.getId(),u.getHoTen(),u.getEmail(),roleNames.isEmpty()?AppRoles.USER:roleNames.get(0),roleNames,permissions);
    }
}
