package com.example.be.dto.request.bill;

import com.example.be.util.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
/*
*  Hàm này dùng để tìm kiếm hóa đơn
*
* */
@Getter
@Setter
public class HoaDonSearchRequest extends PageableRequest {
    private Integer idKhachHang;
    private Integer idNhanVien;
    private String trangThaiHoaDon;
    private String ma;
    private Date fromDate;
    private Date toDate;
}
