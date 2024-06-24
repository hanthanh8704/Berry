package com.example.connectdb.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class NhanVien {
    private static int nextId = 11; // Biến static để theo dõi ID tiếp theo
    private Integer id;
    @NotBlank(message = "Mã không được để trống")
    private String ma;
    @NotBlank(message = "Tên nhân viên không được để trống")
    private String ten;
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String tenDN;
    @NotBlank(message = "Mật khẩu không được để trống")
    private String matKhau;

    private String vaiTro;

    private Integer trangThai;

    public void tangID() {
        this.id = nextId++;
    }

    public String hienThiTT() {
        if (trangThai == 0) {
            return "Hoạt động";
        } else if (trangThai == 1) {
            return "Ngừng hoạt động";
        }
        return null;
    }

}
