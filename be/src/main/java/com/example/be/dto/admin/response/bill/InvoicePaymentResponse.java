package com.example.be.dto.admin.response.bill;

import lombok.*;

/**
 * @author hanthanh
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoicePaymentResponse {

    private String totalMoney;
    private String method;
    private String status;
    private String transactionNo;

}
