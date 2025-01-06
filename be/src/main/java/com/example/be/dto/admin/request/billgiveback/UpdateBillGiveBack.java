package com.example.be.dto.admin.request.billgiveback;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBillGiveBack {
    private Integer idBill;

    private Integer idEmployee;

    private String note;

    private BigDecimal totalBillGiveBack;
    private BigDecimal totalBillGiveBackCustomer;
    private Integer idVoucher;
}
