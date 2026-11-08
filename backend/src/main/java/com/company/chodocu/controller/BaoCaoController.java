package com.company.chodocu.controller;

import com.company.chodocu.entity.BaoCao;
import com.company.chodocu.repository.BaiDangRepository;
import com.company.chodocu.repository.BaoCaoRepository;
import com.company.chodocu.repository.NguoiDungRepository;
import com.company.chodocu.security.AppPermissions;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bao-cao")
public class BaoCaoController {
    private final BaoCaoRepository reports;
    private final BaiDangRepository posts;
    private final NguoiDungRepository users;

    public BaoCaoController(BaoCaoRepository reports, BaiDangRepository posts, NguoiDungRepository users) {
        this.reports = reports;
        this.posts = posts;
        this.users = users;
    }

    @PostMapping
    @Transactional
    public BaoCaoResponse tao(@AuthenticationPrincipal String subject, @Valid @RequestBody TaoBaoCaoRequest request) {
        var user = users.findById(userId(subject)).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."));
        var post = posts.findById(request.idBaiDang()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài đăng."));
        BaoCao report = new BaoCao();
        report.setNguoiDung(user);
        report.setBaiDang(post);
        report.setNoiDung(request.noiDung().trim());
        return toDto(reports.save(report));
    }

    @GetMapping
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('" + AppPermissions.BAO_CAO_XU_LY + "')")
    public PagedResponse<BaoCaoResponse> danhSach(@RequestParam(required = false) String trangThai,
                                                    @RequestParam(defaultValue = "1") int page,
                                                    @RequestParam(defaultValue = "20") int pageSize) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 50);
        var pageable = PageRequest.of(safePage - 1, safeSize);
        var result = trangThai == null || trangThai.isBlank()
                ? reports.findAllByOrderByNgayTaoDesc(pageable)
                : reports.findAllByTrangThaiOrderByNgayTaoDesc(trangThai, pageable);
        long total = result.getTotalElements();
        return new PagedResponse<>(result.getContent().stream().map(this::toDto).toList(), total, safePage, safeSize,
                (long) Math.ceil(total / (double) safeSize));
    }

    @PutMapping("/{id}/xu-ly")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    @PreAuthorize("hasAuthority('" + AppPermissions.BAO_CAO_XU_LY + "')")
    public void xuLy(@PathVariable Integer id, @RequestParam String trangThaiMoi) {
        if (trangThaiMoi == null || trangThaiMoi.isBlank() || trangThaiMoi.length() > 50)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái mới không hợp lệ.");
        BaoCao report = reports.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy báo cáo."));
        report.setTrangThai(trangThaiMoi);
    }

    private BaoCaoResponse toDto(BaoCao x) {
        return new BaoCaoResponse(x.getId(), x.getBaiDang().getId(), x.getBaiDang().getTieuDe(),
                x.getNguoiDung().getId(), x.getNguoiDung().getHoTen(), x.getNoiDung(), x.getNgayTao(), x.getTrangThai());
    }

    private int userId(String value) {
        try { return Integer.parseInt(value); }
        catch (RuntimeException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."); }
    }

    public record TaoBaoCaoRequest(@Positive Integer idBaiDang, @NotBlank @Size(max = 1000) String noiDung) { }
    public record BaoCaoResponse(Integer id, Integer idBaiDang, String tieuDeBaiDang, Integer idNguoiDung,
                                 String tenNguoiBaoCao, String noiDung, LocalDateTime ngayTao, String trangThai) { }
    public record PagedResponse<T>(List<T> items, long totalCount, int page, int pageSize, long totalPages) { }
}
