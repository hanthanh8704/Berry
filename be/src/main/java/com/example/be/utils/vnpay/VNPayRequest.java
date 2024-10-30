package com.example.be.utils.vnpay;

import lombok.Getter;
import lombok.Setter;
/*
* Lớp mô tả các tham số cần thiết cho một yêu cầu thanh toán VNPay.
* */
@Setter
@Getter
public class VNPayRequest {
    private String vnp_Amount;
    private String vnp_BankCode;
    private String vnp_BankTranNo;
    private String vnp_CardType;
    private String vnp_OrderInfo;
    private String vnp_PayDate;
    private String vnp_ResponseCode;
    private String vnp_TmnCode;
    private String vnp_TransactionNo;
    private String vnp_TransactionStatus;
    private String vnp_TxnRef;
    private String vnp_SecureHash;
}
