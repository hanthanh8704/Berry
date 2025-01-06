package com.example.be.dto.admin.request.bill;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class ChangAllStatusBillByIdsRequest {

    @NotNull
    private List<Integer> ids;

    @NotEmpty
    private  String status;

    private String note;

    private Integer idHD;


}
