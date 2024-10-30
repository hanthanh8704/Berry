package com.example.be.dto.admin.request.bill;

import lombok.Getter;
import lombok.Setter;

/*
 *  @author diemdz
 */
@Getter
@Setter
public class CancelBillClientRequest {
    private String id;
    private String description;
}
