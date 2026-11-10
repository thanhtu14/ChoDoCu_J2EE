package com.company.chodocu.controller;

import com.company.chodocu.entity.DichVu;
import com.company.chodocu.repository.DichVuRepository;
import com.company.chodocu.security.AppPermissions;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dich-vu")
public class DichVuController {
    private final DichVuRepository repository;

    public DichVuController(DichVuRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<DichVuResponse> danhSach() {
        return repository.findAllByTrangThaiOrderByIdAsc("HoatDong").stream().map(this::toDto).toList();
    }

    @GetMapping("/quan-tri")
    @Transactional(readOnly = true)
    @PreAuthorize("hasAuthority('" + AppPermissions.DICH_VU_QUAN_LY + "')")
    public List<DichVuResponse> danhSachQuanTri() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermissions.DICH_VU_QUAN_LY + "')")
    public DichVuResponse tao(@Valid @RequestBody DichVuRequest request) {
        DichVu service = new DichVu();
        apply(service, request);
        service.setTrangThai("HoatDong");
        return toDto(repository.save(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermissions.DICH_VU_QUAN_LY + "')")
    public DichVuResponse capNhat(@PathVariable Integer id, @Valid @RequestBody DichVuRequest request) {
        DichVu service = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy gói dịch vụ."));
        apply(service, request);
        return toDto(repository.save(service));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('" + AppPermissions.DICH_VU_QUAN_LY + "')")
    public void ngungBan(@PathVariable Integer id) {
        DichVu service = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy gói dịch vụ."));
        service.setTrangThai("NgungHoatDong");
        repository.save(service);
    }

    private void apply(DichVu service, DichVuRequest request) {
        service.setTenDichVu(request.tenDichVu().trim());
        service.setGia(request.gia());
        service.setThoiGianDichVu(request.thoiGianDichVu());
        service.setLuotDay(request.luotDay());
        service.setLuotDang(request.luotDang());
    }

    private DichVuResponse toDto(DichVu service) {
        return new DichVuResponse(service.getId(), service.getTenDichVu(), service.getGia(),
                service.getThoiGianDichVu(),
                service.getLuotDay(), service.getLuotDang(), service.getNgayTao(), service.getTrangThai());
    }

    public record DichVuRequest(@NotBlank @Size(max = 150) String tenDichVu, @DecimalMin("0.0") BigDecimal gia,
            @Min(0) int thoiGianDichVu, @Min(0) int luotDay, @Min(0) int luotDang) {
    }

    public record DichVuResponse(Integer id, String tenDichVu, BigDecimal gia, int thoiGianDichVu,
            int luotDay, int luotDang, java.time.LocalDateTime ngayTao, String trangThai) {
    }
}
