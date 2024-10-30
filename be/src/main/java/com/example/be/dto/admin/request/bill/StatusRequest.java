package com.example.be.dto.admin.request.bill;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *  @author hanthanh
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusRequest {
    private String id;
    private String status;
}
