package com.example.be.dto.admin.request.bill;

import com.example.be.dto.admin.request.billdetail.CreateBillDetailRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class CreateBillOfflineRequest {

    private String phoneNumber;

    private Integer idUser;

    private String address;

    private String userName;

    @NotEmpty
    private String itemDiscount;

    @NotEmpty
    private String totalMoney;

    private String note;

    @NotEmpty
    private String typeBill;

    @NotEmpty
    private String code;

    private int poin;

    @NotEmpty
    private String statusPayMents;

    private Timestamp deliveryDate;

    private boolean openDelivery;

    private String moneyShip;

    private String email;

    private BigDecimal totalExcessMoney;

    @NotNull
    private List<CreateBillDetailRequest> billDetailRequests;

    @NotNull
    private List<CreatePaymentsMethodRequest> paymentsMethodRequests;
//
    @NotNull
    private List<CreateVoucherDetailRequest> vouchers;

}
