package com.company.chodocu.controller;

import com.company.chodocu.entity.PhuongXa;
import com.company.chodocu.entity.ThanhPho;
import com.company.chodocu.repository.PhuongXaRepository;
import com.company.chodocu.repository.ThanhPhoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dia-chi")
public class DiaChiController {
    private final ThanhPhoRepository thanhPhoRepository;
    private final PhuongXaRepository phuongXaRepository;

    public DiaChiController(ThanhPhoRepository thanhPhoRepository, PhuongXaRepository phuongXaRepository) {
        this.thanhPhoRepository = thanhPhoRepository;
        this.phuongXaRepository = phuongXaRepository;
    }

    @GetMapping("/thanh-pho")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> danhSachThanhPho() {
        return thanhPhoRepository.findAll().stream()
                .map(this::thanhPhoDto)
                .toList();
    }

    @GetMapping("/thanh-pho/{idThanhPho}/phuong-xa")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> danhSachPhuongXa(@PathVariable Integer idThanhPho) {
        return phuongXaRepository.findAllByThanhPho_IdOrderByTenPhuongXaAsc(idThanhPho).stream()
                .map(this::phuongXaDto)
                .toList();
    }

    private Map<String, Object> thanhPhoDto(ThanhPho item) {
        return Map.of("idThanhPho", item.getId(), "tenThanhPho", item.getTenThanhPho());
    }

    private Map<String, Object> phuongXaDto(PhuongXa item) {
        return Map.of("idPhuongXa", item.getId(), "tenPhuongXa", item.getTenPhuongXa(), "idThanhPho", item.getThanhPho().getId());
    }
}
