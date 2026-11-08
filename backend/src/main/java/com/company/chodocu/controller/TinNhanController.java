package com.company.chodocu.controller;

import com.company.chodocu.entity.HoiThoai;
import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.entity.ThongBao;
import com.company.chodocu.entity.TinNhan;
import com.company.chodocu.repository.HoiThoaiRepository;
import com.company.chodocu.repository.NguoiDungRepository;
import com.company.chodocu.repository.ThongBaoRepository;
import com.company.chodocu.repository.TinNhanRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tin-nhan")
public class TinNhanController {
    private final HoiThoaiRepository conversations;
    private final TinNhanRepository messages;
    private final NguoiDungRepository users;
    private final ThongBaoRepository notifications;

    public TinNhanController(HoiThoaiRepository conversations, TinNhanRepository messages,
                             NguoiDungRepository users, ThongBaoRepository notifications) {
        this.conversations = conversations;
        this.messages = messages;
        this.users = users;
        this.notifications = notifications;
    }

    @GetMapping("/hoi-thoai")
    @Transactional(readOnly = true)
    public List<HoiThoaiResponse> danhSachHoiThoai(@AuthenticationPrincipal String subject) {
        int userId = userId(subject);
        return conversations.findAllByIdNguoiDung1_IdOrIdNguoiDung2_IdOrderByTinNhanCuoiDesc(userId, userId).stream()
                .map(conversation -> {
                    NguoiDung other = conversation.getIdNguoiDung1().getId().equals(userId)
                            ? conversation.getIdNguoiDung2() : conversation.getIdNguoiDung1();
                    TinNhan last = conversation.getTinNhans().stream()
                            .max(java.util.Comparator.comparing(TinNhan::getNgayGui)).orElse(null);
                    TinNhanResponse lastDto = last == null ? null : toDto(last);
                    return new HoiThoaiResponse(conversation.getId(), other.getId(), other.getHoTen(), other.getAnhNguoiDung(), lastDto);
                }).toList();
    }

    @GetMapping("/hoi-thoai/{idHoiThoai}")
    @Transactional
    public PagedResponse<TinNhanResponse> danhSachTinNhan(@AuthenticationPrincipal String subject,
                                                           @PathVariable Integer idHoiThoai,
                                                           @RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue = "50") int pageSize) {
        int userId = userId(subject);
        HoiThoai conversation = conversations.findById(idHoiThoai)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hội thoại."));
        if (!conversation.getIdNguoiDung1().getId().equals(userId) && !conversation.getIdNguoiDung2().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem hội thoại này.");
        }
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 100);
        var result = messages.findAllByHoiThoai_IdOrderByNgayGuiDesc(idHoiThoai, PageRequest.of(safePage - 1, safeSize));
        messages.markReadByOtherParticipant(idHoiThoai, userId);
        long total = result.getTotalElements();
        return new PagedResponse<>(result.getContent().stream().map(this::toDto).toList(), total, safePage, safeSize,
                (long) Math.ceil(total / (double) safeSize));
    }

    @PostMapping
    @Transactional
    public TinNhanResponse gui(@AuthenticationPrincipal String subject, @Valid @RequestBody GuiTinNhanRequest request) {
        int senderId = userId(subject);
        if (senderId == request.idNguoiNhan()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể tự nhắn tin cho chính mình.");
        NguoiDung sender = users.findById(senderId).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."));
        NguoiDung recipient = users.findById(request.idNguoiNhan()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người nhận."));
        int first = Math.min(senderId, request.idNguoiNhan());
        int second = Math.max(senderId, request.idNguoiNhan());
        HoiThoai conversation = conversations.findByIdNguoiDung1_IdAndIdNguoiDung2_Id(first, second).orElseGet(() -> {
            HoiThoai created = new HoiThoai();
            created.setIdNguoiDung1(users.getReferenceById(first));
            created.setIdNguoiDung2(users.getReferenceById(second));
            return conversations.save(created);
        });
        TinNhan message = new TinNhan();
        message.setHoiThoai(conversation);
        message.setIdNguoiGui(sender);
        message.setNoiDung(request.noiDung().trim());
        message.setNgayGui(LocalDateTime.now());
        TinNhan saved = messages.save(message);
        conversation.setTinNhanCuoi(saved.getNgayGui());

        ThongBao notification = new ThongBao();
        notification.setIdNguoiDung(recipient);
        notification.setTieuDe("Bạn có tin nhắn mới");
        notification.setNoiDung(request.noiDung().trim());
        notification.setTrangThai("ChuaDoc");
        notifications.save(notification);
        return toDto(saved);
    }

    private TinNhanResponse toDto(TinNhan x) {
        return new TinNhanResponse(x.getId(), x.getHoiThoai().getId(), x.getIdNguoiGui().getId(), x.getNoiDung(), x.isDaDoc(), x.getNgayGui());
    }

    private int userId(String value) {
        try { return Integer.parseInt(value); }
        catch (RuntimeException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."); }
    }

    public record GuiTinNhanRequest(@Positive Integer idNguoiNhan, @NotBlank @Size(max = 4000) String noiDung) { }
    public record TinNhanResponse(Integer id, Integer idHoiThoai, Integer idNguoiGui, String noiDung, boolean daDoc, LocalDateTime ngayTao) { }
    public record HoiThoaiResponse(Integer id, Integer idNguoiDung, String hoTen, String anhNguoiDung, TinNhanResponse tinNhanCuoi) { }
    public record PagedResponse<T>(List<T> items, long totalCount, int page, int pageSize, long totalPages) { }
}
