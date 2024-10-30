package com.example.be.dto.admin.request.bill;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author thangdt
 */
@Getter
@Setter
public class ChangeAllEmployeeRequest {

    @NotNull
    private List<Integer> ids;

    @NotEmpty
    private Integer idEmployee;

}
