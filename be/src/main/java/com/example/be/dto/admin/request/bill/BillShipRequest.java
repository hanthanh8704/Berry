package com.example.be.dto.admin.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BillShipRequest {

    private BigDecimal ship ;

    private Integer idBill;
}
