package com.example.be.dto.admin.request.productDetail;

import com.example.be.utils.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShirtDetailRequest extends PageableRequest {
    private Integer id;
    private String code; // ma

    @NotNull(message = "Please select a color!")
    private String color; // mauSac

    @NotNull(message = "Please select a size!")
    private String size; // kichCo

    @NotNull(message = "Please select a sleeve!")
    private String sleeve; // tayAo

    @NotNull(message = "Please select a material!")
    private String material; // chatLieu

    @NotNull(message = "Please select a collar!")
    private String collar; // coAo

    @NotNull(message = "Please select a brand!")
    private String brand; // thuongHieu

    @NotNull(message = "Quantity cannot be empty!")
    private Integer quantity; // soLuong

    @NotNull(message = "Price cannot be empty!")
    private BigDecimal price; // giaBan

    @NotNull(message = "Weight cannot be empty!")
    private Float weight; // new field for weight

    private BigDecimal discountPrice = BigDecimal.ZERO; // default to 0
    private Integer discountPercentage = 0; // default to 0
    private Integer quantityError;
}
