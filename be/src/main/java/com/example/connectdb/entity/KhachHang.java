package com.example.connectdb.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class KhachHang {
    private static int nextId = 11; // Biến static để theo dõi ID tiếp theo
    private Integer id;
    @NotBlank(message = "Mã không được để trống")
    private String ma;
    @NotBlank(message = "Tên không được để trống")
    private String ten;
    @NotBlank(message = "SDT không được để trống")
    @Pattern(regexp = "^(\\+?84|0)(\\d{9,10})$" , message = "SDT không đúng định dạng")
    private String sdt;
    @NotNull(message = "Trạng thái không được để trống")
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
