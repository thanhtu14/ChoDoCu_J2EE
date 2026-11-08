package com.company.chodocu.service;

import com.company.chodocu.dto.account.*;
import com.company.chodocu.dto.auth.*;
import com.company.chodocu.entity.MaXacThuc;
import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.enums.TrangThaiNguoiDung;
import com.company.chodocu.repository.MaXacThucRepository;
import com.company.chodocu.repository.NguoiDungRepository;
import com.company.chodocu.mapper.NguoiDungMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class AccountSecurityService {
    private static final String PHONE="DOI_SO_DIEN_THOAI", RESET="DAT_LAI_MAT_KHAU";
    private static final SecureRandom RANDOM=new SecureRandom();
    private final NguoiDungRepository users; private final MaXacThucRepository tokens; private final PasswordEncoder encoder;
    private final EmailService email; private final byte[] key;
    private final NguoiDungMapper nguoiDungMapper;
    public AccountSecurityService(NguoiDungRepository users,MaXacThucRepository tokens,PasswordEncoder encoder,EmailService email,NguoiDungMapper nguoiDungMapper,@Value("${app.jwt.key}") String key){
        this.users=users;this.tokens=tokens;this.encoder=encoder;this.email=email;this.nguoiDungMapper=nguoiDungMapper;this.key=key.getBytes(StandardCharsets.UTF_8);
    }

    @Transactional
    public void yeuCauDoiSo(Integer userId,YeuCauDoiSoDienThoaiRequest r){
        NguoiDung user=layUser(userId); String phone=chuanHoaSo(r.soDienThoaiMoi());
        batBuocHoatDong(user);
        if(user.getEmail()==null||user.getEmail().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Tài khoản chưa có email để nhận mã.");
        if(phone.equals(user.getSoDienThoai())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Số điện thoại mới trùng với số hiện tại.");
        if(users.existsBySoDienThoai(phone)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Số điện thoại đã được sử dụng.");
        var previous=tokens.findFirstByIdNguoiDungAndLoaiOrderByIdDesc(userId,PHONE);
        if(previous.isPresent() && previous.get().getNgayTao().plusSeconds(60).isAfter(Instant.now())) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Vui lòng đợi 60 giây trước khi gửi lại mã.");
        String code=String.format("%06d",RANDOM.nextInt(1_000_000));
        MaXacThuc token=new MaXacThuc(); token.setIdNguoiDung(userId); token.setLoai(PHONE); token.setMaHash(hash(userId,PHONE,code)); token.setDuLieu(phone);
        token.setNgayTao(Instant.now()); token.setNgayHetHan(Instant.now().plus(Duration.ofMinutes(10)));
        tokens.deleteByIdNguoiDungAndLoai(userId,PHONE); tokens.save(token);
        try { email.guiMaDoiSo(user.getEmail(),user.getHoTen(),phone,code); }
        catch(RuntimeException ex){ tokens.delete(token); throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Chưa gửi được email xác nhận. Vui lòng thử lại sau."); }
    }

    @Transactional(readOnly=true)
    public HoSoNguoiDungResponse hoSo(Integer userId){
        NguoiDung user=layUser(userId);
        return nguoiDungMapper.toHoSo(user);
    }

    @Transactional
    public NguoiDung xacNhanDoiSo(Integer userId,XacNhanDoiSoDienThoaiRequest r){
        String phone=chuanHoaSo(r.soDienThoaiMoi()); MaXacThuc token=tokens.findFirstByIdNguoiDungAndLoaiOrderByIdDesc(userId,PHONE).orElseThrow(()->maKhongHopLe());
        if(token.getNgayHetHan().isBefore(Instant.now())||!phone.equals(token.getDuLieu())) throw maKhongHopLe();
        if(!MessageDigest.isEqual(token.getMaHash().getBytes(StandardCharsets.UTF_8),hash(userId,PHONE,r.maXacNhan()).getBytes(StandardCharsets.UTF_8))){
            token.setSoLanSai(token.getSoLanSai()+1);
            if(token.getSoLanSai()>=5)tokens.delete(token);else tokens.save(token);
            return null;
        }
        NguoiDung user=layUser(userId);
        batBuocHoatDong(user);
        if(users.existsBySoDienThoai(phone)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Số điện thoại đã được sử dụng.");
        user.setSoDienThoai(phone); users.save(user); tokens.delete(token); return user;
    }

    @Transactional
    public void doiMatKhau(Integer userId,DoiMatKhauRequest r){
        NguoiDung user=layUser(userId);
        batBuocHoatDong(user);
        if(user.getMatKhauHash()==null||!encoder.matches(r.matKhauCu(),user.getMatKhauHash())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mật khẩu hiện tại không đúng.");
        if(r.matKhauCu().equals(r.matKhauMoi())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mật khẩu mới phải khác mật khẩu hiện tại.");
        user.setMatKhauHash(encoder.encode(r.matKhauMoi())); users.save(user);
    }

    @Transactional
    public void quenMatKhau(QuenMatKhauRequest r){
        var found=users.findByEmailIgnoreCase(r.email().trim()); if(found.isEmpty()||found.get().getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG) return;
        NguoiDung user=found.get(); String raw=java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes(32));
        var previous=tokens.findFirstByIdNguoiDungAndLoaiOrderByIdDesc(user.getId(),RESET);
        if(previous.isPresent()&&previous.get().getNgayTao().plusSeconds(60).isAfter(Instant.now()))return;
        MaXacThuc token=new MaXacThuc();token.setIdNguoiDung(user.getId());token.setLoai(RESET);token.setMaHash(hash(user.getId(),RESET,raw));
        token.setNgayTao(Instant.now());token.setNgayHetHan(Instant.now().plus(Duration.ofMinutes(30)));
        tokens.deleteByIdNguoiDungAndLoai(user.getId(),RESET);tokens.save(token);
        try {email.guiLienKetDatLaiMatKhau(user.getEmail(),user.getHoTen(),raw);}
        catch(RuntimeException ex){tokens.delete(token); /* Always return the same result to avoid disclosing registered emails. */}
    }

    @Transactional
    public void datLaiMatKhau(DatLaiMatKhauRequest r){
        NguoiDung user=users.findByEmailIgnoreCase(r.email().trim()).orElseThrow(()->resetTokenInvalid());
        if(user.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG)throw resetTokenInvalid();
        MaXacThuc token=tokens.findFirstByIdNguoiDungAndLoaiOrderByIdDesc(user.getId(),RESET).orElseThrow(()->resetTokenInvalid());
        if(token.getNgayHetHan().isBefore(Instant.now())||!MessageDigest.isEqual(token.getMaHash().getBytes(StandardCharsets.UTF_8),hash(user.getId(),RESET,r.token()).getBytes(StandardCharsets.UTF_8))) throw resetTokenInvalid();
        user.setMatKhauHash(encoder.encode(r.matKhauMoi()));users.save(user);tokens.deleteByIdNguoiDungAndLoai(user.getId(),RESET);
    }

    private NguoiDung layUser(Integer id){return users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy người dùng."));}
    private static void batBuocHoatDong(NguoiDung user){if(user.getTrangThai()!=TrangThaiNguoiDung.HOAT_DONG)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Tài khoản đã bị khóa.");}
    private String hash(Integer userId,String purpose,String raw){
        try {var mac=javax.crypto.Mac.getInstance("HmacSHA256");mac.init(new javax.crypto.spec.SecretKeySpec(key,"HmacSHA256"));return HexFormat.of().formatHex(mac.doFinal((userId+":"+purpose+":"+raw).getBytes(StandardCharsets.UTF_8)));}
        catch(java.security.GeneralSecurityException ex){throw new IllegalStateException(ex);}
    }
    private static byte[] randomBytes(int n){byte[] b=new byte[n];RANDOM.nextBytes(b);return b;}
    private static String chuanHoaSo(String value){String phone=value==null?"":value.replaceAll("\\s","").trim();if(!phone.matches("^(0|\\+84)\\d{9}$"))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Số điện thoại không hợp lệ.");return phone;}
    private static ResponseStatusException maKhongHopLe(){return new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mã xác nhận không đúng hoặc đã hết hạn.");}
    private static ResponseStatusException resetTokenInvalid(){return new ResponseStatusException(HttpStatus.BAD_REQUEST,"Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");}
}
