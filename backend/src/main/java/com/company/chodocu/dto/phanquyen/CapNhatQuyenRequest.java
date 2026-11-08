package com.company.chodocu.dto.phanquyen;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
public record CapNhatQuyenRequest(@NotNull Set<String> maChucNangs) {}
