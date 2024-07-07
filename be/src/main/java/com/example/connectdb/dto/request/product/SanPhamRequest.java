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
    private String ma;

    private String ten;
    private  Integer danhMuc;

    private String trangThai;




}
