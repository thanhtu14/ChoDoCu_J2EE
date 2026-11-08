package com.company.chodocu.dto.account;
import jakarta.validation.constraints.*;
public record XacNhanDoiSoDienThoaiRequest(@NotBlank String soDienThoaiMoi,@NotBlank @Pattern(regexp="\\d{6}") String maXacNhan) {}
