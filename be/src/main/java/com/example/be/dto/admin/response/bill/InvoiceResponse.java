package com.example.be.dto.admin.response.bill;

import lombok.*;

import java.util.List;

/**
 * @author hanthanh
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {

    private String phoneNumber;
    private String address;
    private String userName;
    private String code;
    private String itemDiscount;
    private String totalMoney;
    private String note;
    private String moneyShip;
    private String totalBill;
    private String totalPayment;
    private boolean checkShip;
    private String totalTraSau;
    private String ship;
    private boolean method;
    private boolean typeBill;
    private boolean checkBillTra;
    private String date;
    private Integer quantity;
    private String change;
    private List<InvoiceItemResponse> items;
    private String qr;
    private List<InvoicePaymentResponse> paymentsMethodRequests;

}
