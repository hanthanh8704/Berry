package com.example.connectdb.dto.request.productDetail;


import com.example.connectdb.util.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@ToString

@NoArgsConstructor
@AllArgsConstructor
public class UpdateShirtDetailRequest extends PageableRequest {
    private Integer id;
    private  String ma;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private String mauSac;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private String kichCo;
    @NotNull(message = "Vui lòng chọn tay áo!")
    private String tayAo;
    @NotNull(message = "Vui lòng chọn chất liệu!")
    private String chatLieu;
    @NotNull(message = "Vui lòng chọn cổ áo!")
    private String coAo;
    @NotNull(message = "Vui lòng chọn thương hiệu!")
    private String thuongHieu;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer soLuong;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal giaBan;
}
