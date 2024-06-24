package com.example.connectdb.entity;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import java.time.LocalDate;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Component
public class HoaDon {
    private static int nextId = 4; // Biến static để theo dõi ID tiếp theo
    private Integer id;

    private Integer idNV;

    private Integer idKH;
    @NotBlank(message = "Mã không được để trống")
    private String ma;
    @NotNull(message = "Ngày mua hàng không được để trống")
    @Future(message = "Ngày mua hàng phải ở tương lai")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate ngayMuaHang;

    private Integer trangThai;

    public void tangID() {
        this.id = nextId++;
    }

    public String hienThiTT() {
        if (trangThai == 0) {
            return "Đã thanh toán";
        } else if (trangThai == 1) {
            return "Chưa thanh toán";
        }
        return null;
    }
}
