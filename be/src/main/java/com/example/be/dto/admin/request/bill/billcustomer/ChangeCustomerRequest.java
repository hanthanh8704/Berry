package com.example.be.dto.admin.request.bill.billcustomer;
import com.example.be.entities.Address;
import com.example.be.entities.BillDetail;
import com.example.be.entities.Payment;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ChangeCustomerRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String note;
    private String shippingTime;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal totalMoney;
    private String paymentMethod;
    private Address address;
    private List<BillDetail> billDetail;
    private Integer idVoucher;
    private Payment payMent;
}
