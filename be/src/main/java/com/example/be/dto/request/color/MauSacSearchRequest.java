package com.example.be.dto.request.color;

import com.example.be.util.common.PageableRequest;

import java.sql.Date;

public class MauSacSearchRequest extends PageableRequest {
    private String ma;
    private String ten;
    private String trangThai;
    private Date fromDate;
    private Date toDate;

}
