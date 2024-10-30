package com.example.be.dto.admin.request.billdetail;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BillDetailRequestOne {
    @NotEmpty
    private Integer idBill;

//    private String status;
}
