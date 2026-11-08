package com.company.chodocu.controller;

import com.company.chodocu.entity.BaiDang;
import com.company.chodocu.enums.TrangThaiBaiDang;
import com.company.chodocu.repository.BaiDangRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bai-dang")
public class BaiDangController {
    private final BaiDangRepository repository;

    public BaiDangController(BaiDangRepository repository) { this.repository = repository; }

    @GetMapping
    @Transactional(readOnly = true)
    public PagedResponse<BaiDangResponse> timKiem(@RequestParam(required = false) Integer idDanhMuc,
                                                   @RequestParam(required = false) Integer idThanhPho,
                                                   @RequestParam(required = false) Integer idPhuongXa,
                                                   @RequestParam(required = false) String keyword,
                                                   @RequestParam(required = false) String tuKhoa,
                                                   @RequestParam(required = false) BigDecimal giaTu,
                                                   @RequestParam(required = false) BigDecimal giaDen,
                                                   @RequestParam(defaultValue = "uuTien") String sapXep,
                                                   @RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "20") int pageSize) {
        String term = keyword == null || keyword.isBlank() ? tuKhoa : keyword;
        Specification<BaiDang> specification = publicPosts();
        if (idDanhMuc != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("danhMuc").get("id"), idDanhMuc));
        if (idThanhPho != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("thanhPho").get("id"), idThanhPho));
        if (idPhuongXa != null) specification = specification.and((root, query, cb) -> cb.equal(root.get("phuongXa").get("id"), idPhuongXa));
        if (giaTu != null) specification = specification.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("sanPham").get("giaTien"), giaTu));
        if (giaDen != null) specification = specification.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("sanPham").get("giaTien"), giaDen));
        if (term != null && !term.isBlank()) {
            String pattern = "%" + term.trim().toLowerCase() + "%";
            specification = specification.and((root, query, cb) -> {
                query.distinct(true);
                return cb.or(cb.like(cb.lower(root.get("tieuDe")), pattern),
                        cb.like(cb.lower(root.get("noiDung")), pattern),
                        cb.like(cb.lower(root.get("sanPham").get("tenSanPham")), pattern));
            });
        }
        Sort sort = "giaTang".equalsIgnoreCase(sapXep)
                ? Sort.by(Sort.Direction.ASC, "sanPham.giaTien")
                : "giaGiam".equalsIgnoreCase(sapXep)
                ? Sort.by(Sort.Direction.DESC, "sanPham.giaTien")
                : Sort.by(Sort.Direction.DESC, "uuTien").and(Sort.by(Sort.Direction.DESC, "ngayDang"));
        return search(specification, page, pageSize, sort);
    }

    @GetMapping("/noi-bat")
    @Transactional(readOnly = true)
    public List<BaiDangResponse> noiBat(@RequestParam(defaultValue = "12") int soLuong) {
        int limit = Math.min(Math.max(soLuong, 1), 50);
        return repository.findAll(publicPosts(), PageRequest.of(0, limit,
                        Sort.by(Sort.Direction.DESC, "uuTien").and(Sort.by(Sort.Direction.DESC, "ngayDang"))))
                .getContent().stream().map(this::toDto).toList();
    }

    @GetMapping("/cua-toi")
    @Transactional(readOnly = true)
    public PagedResponse<BaiDangResponse> cuaToi(@AuthenticationPrincipal String subject,
                                                  @RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "20") int pageSize) {
        int userId = userId(subject);
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 100);
        var result = repository.findAllByNguoiDang_IdOrderByNgayDangDesc(userId,
                PageRequest.of(safePage - 1, safeSize));
        long total = result.getTotalElements();
        return new PagedResponse<>(result.getContent().stream().map(this::toDto).toList(), total, safePage, safeSize,
                (long) Math.ceil(total / (double) safeSize));
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public BaiDangResponse chiTiet(@PathVariable Integer id) {
        BaiDang post = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài đăng."));
        if (post.getTrangThai() != TrangThaiBaiDang.DA_DUYET)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài đăng.");
        return toDto(post);
    }

    private Specification<BaiDang> publicPosts() {
        return (root, query, cb) -> cb.equal(root.get("trangThai"), TrangThaiBaiDang.DA_DUYET);
    }

    private PagedResponse<BaiDangResponse> search(Specification<BaiDang> specification, int page, int pageSize, Sort sort) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 100);
        var result = repository.findAll(specification, PageRequest.of(safePage - 1, safeSize, sort));
        long total = result.getTotalElements();
        return new PagedResponse<>(result.getContent().stream().map(this::toDto).toList(), total, safePage, safeSize,
                (long) Math.ceil(total / (double) safeSize));
    }

    private BaiDangResponse toDto(BaiDang post) {
        List<String> images = post.getAnhSanPhams().stream().map(image -> image.getDuongDan()).toList();
        return new BaiDangResponse(post.getId(), post.getTieuDe(), post.getNoiDung(), post.getSanPham().getTenSanPham(),
                post.getSanPham().getGiaTien(), post.getDiaChi(), post.getDiaChiChiTiet(), post.getNgayDang(),
                switch (post.getTrangThai()) {
                    case DA_DUYET -> "DaDuyet";
                    case CHO_DUYET -> "ChoDuyet";
                    case TU_CHOI -> "TuChoi";
                    case DA_AN -> "DaAn";
                }, post.getNguoiDang().getId(),
                post.getNguoiDang().getHoTen(), post.getDanhMuc().getTenDanhMuc(), post.getThanhPho().getTenThanhPho(), images);
    }

    private int userId(String value) {
        try { return Integer.parseInt(value); }
        catch (RuntimeException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."); }
    }

    public record BaiDangResponse(Integer id, String tieuDe, String noiDung, String tenSanPham, BigDecimal giaTien,
                                  String diaChi, String diaChiChiTiet, LocalDateTime ngayDang, String trangThai,
                                  Integer idNguoiDung, String tenNguoiDang, String tenDanhMuc, String tenThanhPho,
                                  List<String> anhs) { }
    public record PagedResponse<T>(List<T> items, long totalCount, int page, int pageSize, long totalPages) { }
}
