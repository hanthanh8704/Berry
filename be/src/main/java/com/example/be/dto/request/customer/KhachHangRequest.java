package com.example.be.dto.request.customer;

import com.example.be.util.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
@Getter
@Setter
public class KhachHangRequest extends PageableRequest {
    private String taiKhoan;
    private String matKhau;
    private String ma;
    private String hoTen;
    private String gioiTinh;
    private String soDienThoai;
    private MultipartFile anh;
    private String trangThai;
    private Boolean deleted;
    private String tenChucVu;

    private DiaChiRequest diaChiRequest;
}
