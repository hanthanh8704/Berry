package com.example.be.dto.request.dotgiamgia;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class DotGiamGiaRequest {
    private Integer id;

    private String ma;

    private String ten;



    private Integer giaTriGiam;

    private String trangThai;


    private LocalDateTime ngayBatDau;


    private LocalDateTime ngayKetThuc;

    private LocalDateTime ngayTao;

    private LocalDateTime ngaySua;

    private String nguoiTao;

    private String nguoiSua;
    private Boolean deleted;
    private List<Integer> productDetails;
}
