package com.company.chodocu.controller;

import com.company.chodocu.entity.Banner;
import com.company.chodocu.repository.BannerRepository;
import com.company.chodocu.security.AppPermissions;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/banner")
public class BannerController {
    private final BannerRepository repository;

    public BannerController(BannerRepository repository) { this.repository = repository; }

    @GetMapping
    @Transactional(readOnly = true)
    public List<BannerResponse> danhSach(@RequestParam(required = false) String viTri) {
        List<Banner> banners = viTri == null || viTri.isBlank()
                ? repository.findAllByOrderByIdDesc()
                : repository.findAllByViTriOrderByIdDesc(viTri);
        return banners.stream().map(this::toDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAuthority('" + AppPermissions.BANNER_QUAN_LY + "')")
    public BannerResponse tao(@Valid @RequestBody TaoBannerRequest request) {
        Banner banner = new Banner();
        banner.setHinhAnh(request.hinhAnh());
        banner.setViTri(request.viTri());
        banner.setTrangThai("HoatDong");
        banner.setNgaySua(LocalDateTime.now());
        return toDto(repository.save(banner));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('" + AppPermissions.BANNER_QUAN_LY + "')")
    public void xoa(@PathVariable Integer id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy banner.");
        repository.deleteById(id);
    }

    private BannerResponse toDto(Banner banner) {
        return new BannerResponse(banner.getId(), banner.getHinhAnh(), banner.getViTri(), banner.getNgaySua());
    }

    public record TaoBannerRequest(@NotBlank @Size(max = 1000) String hinhAnh, @Size(max = 100) String viTri) { }
    public record BannerResponse(Integer id, String hinhAnh, String viTri, LocalDateTime ngaySua) { }
}
