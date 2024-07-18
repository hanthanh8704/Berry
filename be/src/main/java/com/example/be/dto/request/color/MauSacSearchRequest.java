package com.example.connectdb.dto.request.color;

import com.example.connectdb.util.common.PageableRequest;

import java.sql.Date;

public class MauSacSearchRequest extends PageableRequest {
    private String ma;
    private String ten;
    private String trangThai;
    private Date fromDate;
    private Date toDate;

}
