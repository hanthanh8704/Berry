package com.example.be.dto.admin.request.billdetail;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class RefundProductRequest {

    @NotEmpty
    private Integer id;

    @NotEmpty
    private Integer idBill;

    @NotEmpty
    private Integer idProduct;

    @NotNull
    private String sizeName;

    @NotNull
    private Integer quantity;

    @NotEmpty
    private String totalMoney;

    @NotEmpty
    private String note;

}
