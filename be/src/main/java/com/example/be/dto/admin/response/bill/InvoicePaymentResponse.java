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

    private String total;
    private String method;
    private String status;
    private String vnp_TransactionNo;

}
