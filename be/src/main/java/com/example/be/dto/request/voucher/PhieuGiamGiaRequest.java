package com.example.be.dto.request.voucher;

import com.example.be.util.common.PageableRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuGiamGiaRequest extends PageableRequest {
    private Integer id;
    private String ma;
    private String ten;
    private Integer soLuong;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayBatDau;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayKetThuc;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayTao;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngaySua;
    private String trangThai;
    private BigDecimal giaTriHoaDonDuocApDung;
    private BigDecimal giaTriHoaDonDuocGiam;
    private String hinhThucGiam;
    private String loai;
    private String nguoiTao;
    private String nguoiSua;
    private List<Integer> customers;
    private Boolean deleted;
}
