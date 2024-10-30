package com.example.be.dto.admin.request.bill;


import com.example.be.utils.constant.StatusMethod;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class ChangStatusBillRequest {

    @NotEmpty
    private String actionDescription;

    private StatusMethod method;

    private String totalMoney;

     private  boolean statusCancel = false;

}
