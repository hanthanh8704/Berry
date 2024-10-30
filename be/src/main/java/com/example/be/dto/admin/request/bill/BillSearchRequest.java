package com.example.be.dto.admin.request.bill;


import com.example.be.utils.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

/*
*  Hàm này dùng để tìm kiếm hóa đơn
*
* */
@Getter
@Setter
public class BillSearchRequest extends PageableRequest {
    private Integer idCustomer;
    private Integer idEmployee;
    private String invoiceStatus;
    private String code;
    private Date fromDate;
    private Date toDate;
}
