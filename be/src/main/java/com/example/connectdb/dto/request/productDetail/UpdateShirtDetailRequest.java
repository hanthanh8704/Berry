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
public class UpdateShirtDetailRequest extends PageableRequest {
    private Integer id;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private Integer mauSac;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private Integer kichCo;
    @NotNull(message = "Vui lòng chọn tay áo!")
    private Integer tayAo;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer soLuong;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal giaBan;
}
