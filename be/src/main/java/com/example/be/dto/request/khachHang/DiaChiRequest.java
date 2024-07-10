package com.example.be.dto.request.khachHang;

import com.example.be.entity.KhachHang;
import com.example.be.util.common.PageableRequest;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DiaChiRequest extends PageableRequest {
    private Integer idKhachHang;
    private String hoTen;
    private String soDienThoai;
    private String thanhPho;
    private String huyen;
    private String phuong;
    private Boolean diaChiMacDinh;
    private String diaChiCuThe;
    private String trangThai;
    private String nguoiTao;
    private String nguoiSua;

}
