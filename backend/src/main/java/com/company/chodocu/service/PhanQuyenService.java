package com.company.chodocu.service;
import com.company.chodocu.entity.*;
import com.company.chodocu.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@Service
public class PhanQuyenService {
    private final VaiTroRepository roles; private final ChucNangRepository permissions;
    public PhanQuyenService(VaiTroRepository roles,ChucNangRepository permissions){this.roles=roles;this.permissions=permissions;}
    @Transactional(readOnly=true) public List<Map<String,Object>> danhSach(){
        return roles.findAll().stream().map(r->Map.<String,Object>of("maVaiTro",r.getMaVaiTro(),"tenVaiTro",r.getTenVaiTro(),"maChucNangs",r.getChucNangs().stream().map(ChucNang::getMaChucNang).sorted().toList())).toList();
    }
    @Transactional(readOnly=true) public List<Map<String,String>> danhSachChucNang(){
        return permissions.findAllByOrderByMaChucNangAsc().stream().map(p->Map.of("maChucNang",p.getMaChucNang(),"tenChucNang",p.getTenChucNang())).toList();
    }
    @Transactional public void capNhat(String maVaiTro,Set<String> codes){
        VaiTro role=roles.findByMaVaiTro(maVaiTro).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy vai trò."));
        List<ChucNang> found=permissions.findAllByOrderByMaChucNangAsc().stream().filter(p->codes.contains(p.getMaChucNang())).toList();
        if(found.size()!=codes.size()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Có mã chức năng không hợp lệ.");
        role.setChucNangs(new LinkedHashSet<>(found)); roles.save(role);
    }
}
