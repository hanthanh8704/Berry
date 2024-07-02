package com.example.connectdb.dto.request.productDetail;


import com.example.connectdb.util.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@ToString
public class ProductDetailRequest extends PageableRequest {
    private Integer id;
    private String ma;
    private  String ten;
    @NotNull(message = "Vui lòng chọn sản phẩm!")
    private Integer sanPham;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private Integer mauSac;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private Integer kichCo;
    @NotNull(message = "Vui lòng chọn chất liệu!")
    private Integer chatLieu;
    @NotNull(message = "Vui lòng chọn tay áo!")
    private Integer tayAo;
    @NotNull(message = "Vui lòng chọn cổ áo!")
    private Integer coAo;
    @NotNull(message = "Vui lòng chọn thương hiệu!")
    private Integer thuongHieu;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer soLuong;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal giaBan;
    @NotEmpty(message = "Hình ảnh không được để trống!")
    private List<String> listImages;
}
