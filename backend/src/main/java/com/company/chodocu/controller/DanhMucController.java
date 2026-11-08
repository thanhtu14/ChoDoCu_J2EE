package com.company.chodocu.controller;

import com.company.chodocu.entity.DanhMuc;
import com.company.chodocu.repository.DanhMucRepository;
import com.company.chodocu.security.AppPermissions;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/danh-muc")
public class DanhMucController {
    private final DanhMucRepository repository;

    public DanhMucController(DanhMucRepository repository) { this.repository = repository; }

    @GetMapping
    @Transactional(readOnly = true)
    public List<DanhMucDto> getCay() {
        List<DanhMuc> all = repository.findAllByOrderByTenDanhMucAsc();
        Map<Integer, List<DanhMuc>> childrenByParent = all.stream()
                .filter(category -> category.getDanhMucCha() != null)
                .collect(Collectors.groupingBy(category -> category.getDanhMucCha().getId()));
        return all.stream().filter(category -> category.getDanhMucCha() == null)
                .map(category -> toDto(category, childrenByParent)).toList();
    }

    private DanhMucDto toDto(DanhMuc category, Map<Integer, List<DanhMuc>> childrenByParent) {
        List<DanhMucDto> children = childrenByParent.getOrDefault(category.getId(), new ArrayList<>()).stream()
                .map(child -> toDto(child, childrenByParent)).toList();
        return new DanhMucDto(category.getId(), category.getDanhMucCha() == null ? null : category.getDanhMucCha().getId(),
                category.getTenDanhMuc(), category.getAnhDanhMuc(), category.getTrangThai(), children);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + AppPermissions.DANH_MUC_QUAN_LY + "')")
    public DanhMucDto tao(@Valid @RequestBody TaoDanhMucRequest request) {
        DanhMuc category = new DanhMuc();
        category.setTenDanhMuc(request.tenDanhMuc().trim());
        category.setAnhDanhMuc(request.anhDanhMuc());
        if (request.idDanhMucCha() != null) {
            category.setDanhMucCha(repository.findById(request.idDanhMucCha())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục cha.")));
        }
        category = repository.save(category);
        return toDto(category, Map.of());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + AppPermissions.DANH_MUC_QUAN_LY + "')")
    public DanhMucDto capNhat(@PathVariable Integer id, @Valid @RequestBody CapNhatDanhMucRequest request) {
        DanhMuc category = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục."));
        category.setTenDanhMuc(request.tenDanhMuc().trim());
        category.setAnhDanhMuc(request.anhDanhMuc());
        category.setTrangThai(request.trangThai());
        return toDto(repository.save(category), Map.of());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('" + AppPermissions.DANH_MUC_QUAN_LY + "')")
    public void xoa(@PathVariable Integer id) {
        DanhMuc category = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục."));
        if (repository.existsByDanhMucCha_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Không thể xóa danh mục đang có danh mục con.");
        }
        repository.delete(category);
    }

    public record DanhMucDto(Integer id, Integer idDanhMucCha, String tenDanhMuc, String anhDanhMuc,
                             String trangThai, List<DanhMucDto> danhMucCons) { }
    public record TaoDanhMucRequest(Integer idDanhMucCha, @NotBlank @Size(max = 150) String tenDanhMuc,
                                    @Size(max = 1000) String anhDanhMuc) { }
    public record CapNhatDanhMucRequest(@NotBlank @Size(max = 150) String tenDanhMuc,
                                       @Size(max = 1000) String anhDanhMuc, @NotBlank @Size(max = 30) String trangThai) { }
}
