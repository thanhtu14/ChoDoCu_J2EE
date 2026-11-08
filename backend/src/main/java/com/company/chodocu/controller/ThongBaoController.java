package com.company.chodocu.controller;

import com.company.chodocu.entity.ThongBao;
import com.company.chodocu.repository.ThongBaoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/thong-bao")
public class ThongBaoController {
    private final ThongBaoRepository repository;

    public ThongBaoController(ThongBaoRepository repository) { this.repository = repository; }

    @GetMapping
    @Transactional(readOnly = true)
    public PagedResponse<ThongBaoResponse> danhSach(@AuthenticationPrincipal String subject,
                                                      @RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "20") int pageSize) {
        int userId = userId(subject);
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 50);
        var result = repository.findAllByIdNguoiDung_IdOrderByNgayTaoDesc(userId, PageRequest.of(safePage - 1, safeSize));
        long totalCount = result.getTotalElements();
        return new PagedResponse<>(result.getContent().stream().map(this::toDto).toList(), totalCount, safePage, safeSize,
                (long) Math.ceil(totalCount / (double) safeSize));
    }

    @GetMapping("/dem-chua-doc")
    public DemChuaDocResponse demChuaDoc(@AuthenticationPrincipal String subject) {
        return new DemChuaDocResponse(repository.countByIdNguoiDung_IdAndTrangThai(userId(subject), "ChuaDoc"));
    }

    @PutMapping("/{id}/da-doc")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void danhDauDaDoc(@AuthenticationPrincipal String subject, @PathVariable Integer id) {
        ThongBao notification = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông báo."));
        if (!notification.getIdNguoiDung().getId().equals(userId(subject))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền với thông báo này.");
        }
        notification.setTrangThai("DaDoc");
    }

    @PutMapping("/da-doc-tat-ca")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void danhDauTatCaDaDoc(@AuthenticationPrincipal String subject) {
        repository.findAllByIdNguoiDung_IdAndTrangThai(userId(subject), "ChuaDoc")
                .forEach(item -> item.setTrangThai("DaDoc"));
    }

    private ThongBaoResponse toDto(ThongBao x) {
        return new ThongBaoResponse(x.getId(), x.getTieuDe(), x.getNoiDung(), x.getNgayTao(), x.getTrangThai());
    }

    private int userId(String value) {
        try { return Integer.parseInt(value); }
        catch (RuntimeException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."); }
    }

    public record ThongBaoResponse(Integer id, String tieuDe, String noiDung, java.time.LocalDateTime ngayTao, String trangThai) { }
    public record PagedResponse<T>(List<T> items, long totalCount, int page, int pageSize, long totalPages) { }
    public record DemChuaDocResponse(long soLuong) { }
}
