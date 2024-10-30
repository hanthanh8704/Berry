package com.example.be.dto.admin.request.product;

import com.example.be.utils.common.PageableRequest;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShirtRequest extends PageableRequest {

    private Integer id;
    private String code; // Đổi từ 'ma' thành 'code'
    private String name; // Đổi từ 'ten' thành 'name'
    private Integer category;
    private String status;
    private Timestamp createdAt;
    private Timestamp updatedAt; // Đổi từ 'ngaySua' thành 'updatedAt'


}
