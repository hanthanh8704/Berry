package com.example.connectdb.entity;

import jakarta.validation.constraints.*;
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
public class SPCT {
    private static int nextId = 4; // Biến static để theo dõi ID tiếp theo
    private Integer id;
    @NotBlank(message = "Mã không được để trống")
    private String ma;

    private Integer idKichThuoc;

    private Integer idMauSac;

    private Integer idSanPham;
    @NotNull(message = "Số lượng không được trống")
    @Positive(message = "Số lượng phải là số dương")
    @Digits(message = "Số lượng phải đúng định dạng", integer = 3, fraction = 2)
    private Integer soLuong;
    @NotNull(message = "Đơn giá không được trống")
    @DecimalMin(value = "10", message = "Đơn giá phải lớn hơn 10")
    @Digits(message = "Đơn giá phải đúng định dạng", integer = 3, fraction = 2)
    private Double donGia;
    @NotNull(message = "Trạng thái không được để trống")
    private Integer trangThai;

    public String hienThiTT() {
        if (trangThai == 0) {
            return "Hoạt động";
        } else if (trangThai == 1) {
            return "Ngừng hoạt động";
        }
        return null;
    }

    public void tangID() {
        this.id = nextId++;
    }
}
