package com.example.connectdb.dto.request.product;


import com.example.connectdb.util.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
/*
*  Hàm này dùng để tìm kiếm hóa đơn
*
* */
@Getter
@Setter
public class SanPhamSearchRequest extends PageableRequest {
    private Integer idKhachHang;
    private Integer idNhanVien;
    private String trangThaiHoaDon;
    private String ma;
    private Date fromDate;
    private Date toDate;
}
