package com.example.be.dto.request.billHistory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillHistoryRequest {
    private Integer idHoaDon;
    private Integer idNhanVien;
    private String ghiChu;
    private String trangThai;
}
