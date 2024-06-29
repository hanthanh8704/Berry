package com.example.connectdb.dto.request.productDetail;


import com.example.connectdb.util.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductDetailRequest extends PageableRequest {
    private Integer id;
    @NotNull(message = "Đơn giá không được để trống!")
    private Integer soLuong;
    private BigDecimal gia;
    private Integer IdHoaDon;
    private String maSPCT;

    // Filter
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String ma;
    private String trangThai;
}
