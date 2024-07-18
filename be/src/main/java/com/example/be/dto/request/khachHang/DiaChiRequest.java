package com.example.be.dto.request.khachHang;

import com.example.be.entity.KhachHang;
import com.example.be.util.common.PageableRequest;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DiaChiRequest extends PageableRequest {
    private Integer idKhachHang;
    private String hoTen;
    @Pattern(regexp = "^0[0-10]{10}$", message = "Số điện thoại không hợp lệ")
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
