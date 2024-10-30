package com.example.be.dto.admin.request.productDetail;

import com.example.be.utils.common.PageableRequest;
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
public class ShirtDetailRequest extends PageableRequest {
    private Integer id;
    private String code;
    private String name;

    @NotNull(message = "Please select a product!")
    private Integer product;

    @NotNull(message = "Please select a color!")
    private Integer color;

    @NotNull(message = "Please select a size!")
    private Integer size;

    @NotNull(message = "Please select a material!")
    private Integer material;

    @NotNull(message = "Please select a sleeve!")
    private Integer sleeve;

    @NotNull(message = "Please select a collar!")
    private Integer collar;

    @NotNull(message = "Please select a brand!")
    private Integer brand;

    @NotNull(message = "Quantity cannot be empty!")
    private Integer quantity;

    @NotNull(message = "Price cannot be empty!")
    private BigDecimal price;

    @NotEmpty(message = "Images cannot be empty!")
    private List<String> listImages;
}
