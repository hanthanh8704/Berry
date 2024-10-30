package com.example.be.dto.admin.request.bill;


import com.example.be.utils.ConvertDateToLong;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class FindNewBillCreateAtCounterRequest {

    private Long startCreateBill = new ConvertDateToLong().getLongDateNow();

    private Long endCreateBill =  new ConvertDateToLong().getLongDateNow();

    private String key;

}
