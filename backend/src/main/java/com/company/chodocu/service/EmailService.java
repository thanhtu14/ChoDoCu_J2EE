package com.company.chodocu.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender sender;
    private final String from,resetUrl;
    public EmailService(JavaMailSender sender,@Value("${app.mail.from:no-reply@chodocu.local}") String from,
                        @Value("${app.mail.reset-url:http://localhost:5173/quen-mat-khau}") String resetUrl){this.sender=sender;this.from=from;this.resetUrl=resetUrl;}
    public void guiMaDoiSo(String email,String ten,String so,String code){
        gui(email,"Mã xác nhận đổi số điện thoại - Chợ Đồ Cũ","Xin chào "+ten+",\n\nMã xác nhận đổi số điện thoại sang "+so+" là: "+code+"\nMã hết hạn sau 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.");
    }
    public void guiLienKetDatLaiMatKhau(String email,String ten,String token){
        String link=resetUrl+"?email="+java.net.URLEncoder.encode(email,java.nio.charset.StandardCharsets.UTF_8)+"&token="+java.net.URLEncoder.encode(token,java.nio.charset.StandardCharsets.UTF_8);
        gui(email,"Liên kết đặt lại mật khẩu - Chợ Đồ Cũ","Xin chào "+ten+",\n\nMở liên kết sau để tạo mật khẩu mới (có hiệu lực trong 30 phút và chỉ dùng một lần):\n"+link+"\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.");
    }
    private void gui(String to,String subject,String body){
        SimpleMailMessage message=new SimpleMailMessage(); message.setFrom(from); message.setTo(to); message.setSubject(subject); message.setText(body); sender.send(message);
    }
}
