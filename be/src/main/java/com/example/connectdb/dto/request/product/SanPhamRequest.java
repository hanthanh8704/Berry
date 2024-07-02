package com.example.connectdb.dto.request.product;

import com.example.connectdb.util.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SanPhamRequest extends PageableRequest {
    // DTO Data Transfer Object
    private Integer id;
    @NotEmpty(message = "Mã không được để trống!")
    private String ma;
    @NotEmpty(message = "Tên không được để trống!")
    private String tenSanPham;
    @NotNull(message = "Danh mục không được để trống!")
    private  Integer danhMuc;
    @NotNull(message = "Thương hiệu không được để trống!")
    private Integer thuongHieu;
    private  Integer soLuong;
    private String trangThai;




}
