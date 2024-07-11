package com.example.connectdb.dto.request.product;


import com.example.connectdb.util.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

/*
*  Hàm này dùng để tìm kiếm hóa đơn
*
* */
@Getter
@Setter
@Builder
public class SanPhamSearchRequest extends PageableRequest {
    private Integer id;
    private String ten;
    private String mauSac;
    private String kichCo;
    private String chatLieu;
    private String thuongHieu;
    private String tayAo;
    private String coAo;
    private String danhMuc;
    private Integer soLuong;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String trangThai;

}
