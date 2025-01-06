package com.example.be.dto.admin.request.billgiveback;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChangAllStatusBillGiveBackIdsRequest {
    @NotNull
    private List<Integer> idReturnOrderDetails;
}
