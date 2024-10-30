package com.example.be.dto.admin.request.bill;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateVoucherDetailRequest {

    private Integer idVoucher;

    private String beforPrice;

    private String afterPrice;

    private String discountPrice;


}
