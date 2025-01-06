package com.example.be.dto.admin.request.bill;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * @author thangdt
 */
@Getter
@Setter
public class ChangeEmployeeRequest {

    @NotNull
    private Integer idHD;

    @NotNull
    private Integer idEmployee;
}
