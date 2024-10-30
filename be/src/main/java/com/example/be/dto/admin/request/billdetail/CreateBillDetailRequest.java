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
public class CreateBillDetailRequest {

    @NotEmpty
    private Integer idBill;

    @NotEmpty
    private Integer idProduct;

    @NotNull
    private int quantity;

    @NotEmpty
    private String totalMoney;

    @NotEmpty
    private String price;

    private Integer promotion;

    private String note;
}
