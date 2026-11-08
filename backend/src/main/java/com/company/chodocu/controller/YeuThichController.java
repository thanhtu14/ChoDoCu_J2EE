package com.company.chodocu.controller;

import com.company.chodocu.entity.BaiDang;
import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.entity.ThongBao;
import com.company.chodocu.entity.YeuThich;
import com.company.chodocu.repository.BaiDangRepository;
import com.company.chodocu.repository.NguoiDungRepository;
import com.company.chodocu.repository.ThongBaoRepository;
import com.company.chodocu.repository.YeuThichRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/yeu-thich")
public class YeuThichController {
    private final YeuThichRepository favorites;
    private final BaiDangRepository posts;
    private final NguoiDungRepository users;
    private final ThongBaoRepository notifications;

    public YeuThichController(YeuThichRepository favorites, BaiDangRepository posts,
                              NguoiDungRepository users, ThongBaoRepository notifications) {
        this.favorites = favorites;
        this.posts = posts;
        this.users = users;
        this.notifications = notifications;
    }

    @PostMapping("/{idBaiDang}")
    @Transactional
    public ToggleResponse toggle(@AuthenticationPrincipal String subject, @PathVariable Integer idBaiDang) {
        int userId = userId(subject);
        BaiDang post = posts.findById(idBaiDang)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy bài đăng."));
        var existing = favorites.findByIdNguoiDung_IdAndIdBaiDang_Id(userId, idBaiDang);
        if (existing.isPresent()) {
            favorites.delete(existing.get());
            return new ToggleResponse(false);
        }
        NguoiDung user = users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."));
        YeuThich favorite = new YeuThich();
        favorite.setIdNguoiDung(user);
        favorite.setIdBaiDang(post);
        favorite.setNgayTao(LocalDateTime.now());
        favorites.save(favorite);

        if (!post.getNguoiDang().getId().equals(userId)) {
            ThongBao notification = new ThongBao();
            notification.setIdNguoiDung(post.getNguoiDang());
            notification.setTieuDe("Bài đăng của bạn có lượt thích mới");
            notification.setNoiDung("Bài đăng \"" + post.getTieuDe() + "\" vừa được một người dùng yêu thích.");
            notification.setTrangThai("ChuaDoc");
            notifications.save(notification);
        }
        return new ToggleResponse(true);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public PagedResponse<YeuThichResponse> danhSach(@AuthenticationPrincipal String subject,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "20") int pageSize) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(pageSize, 1), 50);
        var result = favorites.findAllByIdNguoiDung_IdOrderByNgayTaoDesc(userId(subject), PageRequest.of(safePage - 1, safeSize));
        List<YeuThichResponse> items = result.getContent().stream().map(f -> {
            BaiDang post = f.getIdBaiDang();
            String image = post.getAnhSanPhams().stream().findFirst().map(a -> a.getDuongDan()).orElse(null);
            return new YeuThichResponse(f.getId(), post.getId(), post.getTieuDe(), post.getSanPham().getGiaTien(), image, f.getNgayTao());
        }).toList();
        long total = result.getTotalElements();
        return new PagedResponse<>(items, total, safePage, safeSize, (long) Math.ceil(total / (double) safeSize));
    }

    private int userId(String value) {
        try { return Integer.parseInt(value); }
        catch (RuntimeException e) { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token không hợp lệ."); }
    }

    public record ToggleResponse(boolean daThich) { }
    public record YeuThichResponse(Integer id, Integer idBaiDang, String tieuDe, java.math.BigDecimal giaTien,
                                   String anhDaiDien, LocalDateTime ngayTao) { }
    public record PagedResponse<T>(List<T> items, long totalCount, int page, int pageSize, long totalPages) { }
}
