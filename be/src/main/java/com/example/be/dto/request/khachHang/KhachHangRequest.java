package com.example.be.dto.request.khachHang;

import com.example.be.util.common.PageableRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.sql.Timestamp;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangRequest extends PageableRequest {
    private Integer id;
    private String hoTen;
    private String ma;
    private MultipartFile anh;
    private String trangThai;
    private String gioiTinh;
    private Date ngaySinh;
    @Pattern(regexp = "^0[0-9]{9}$", message = "Số điện thoại không hợp lệ")
    private String soDienThoai;
    @Email(message = "Email không hợp lệ")
    private String email;
    private DiaChiRequest diaChiRequest;
    private AccountRequest accountRequest;
    private Timestamp ngayTao;
    private Timestamp ngaySua;
    private Boolean deleted;
}
