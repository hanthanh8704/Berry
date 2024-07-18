package com.example.be.dto.request.product;

import com.example.be.util.common.PageableRequest;
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

    private Integer id;
    private String ma;
    private String ten;
    private Integer danhMuc;
    private String trangThai;


}
