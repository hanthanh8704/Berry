package com.example.be.dto.request.nhanVien;

import com.example.be.entity.NhanVien;
import com.example.be.util.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
public class NhanVienRequest extends PageableRequest {
    private Integer id;

    private Integer idChucVu;
//    private String anh;
    private String ma;
    private String ten;
    private String diaChi;
    private Date ngaySinh;
    private String soDienThoai;
    private String gioiTinh;
    private String email;
    private String cccd;
    private String matKhau;
    private String taiKhoan;
    private Boolean deleted;
    private String trangThai;
    private Timestamp ngayTao;
    private Timestamp ngaySua;

}
