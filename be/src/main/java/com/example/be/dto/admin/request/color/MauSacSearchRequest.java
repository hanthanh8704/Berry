package com.example.be.dto.admin.request.color;

import com.example.be.utils.common.PageableRequest;

import java.sql.Date;

public class MauSacSearchRequest extends PageableRequest {
    private String code;  // Đổi từ ma -> code
    private String name;  // Đổi từ ten -> name
    private String status;  // Đổi từ trangThai -> status
    private Date fromDate;
    private Date toDate;

}
