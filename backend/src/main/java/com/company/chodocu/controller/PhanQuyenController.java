package com.company.chodocu.controller;
import com.company.chodocu.dto.phanquyen.CapNhatQuyenRequest;
import com.company.chodocu.service.PhanQuyenService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/phan-quyen") @PreAuthorize("hasAuthority('PERMISSION_PhanQuyen.QuanLy')")
public class PhanQuyenController {
    private final PhanQuyenService service;
    public PhanQuyenController(PhanQuyenService service){this.service=service;}
    @GetMapping("/vai-tro") public List<Map<String,Object>> danhSachVaiTro(){return service.danhSach();}
    @GetMapping("/chuc-nang") public List<Map<String,String>> danhSachChucNang(){return service.danhSachChucNang();}
    @PutMapping("/vai-tro/{maVaiTro}/chuc-nang") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void capNhat(@PathVariable String maVaiTro,@Valid @RequestBody CapNhatQuyenRequest request){service.capNhat(maVaiTro,request.maChucNangs());}
}
