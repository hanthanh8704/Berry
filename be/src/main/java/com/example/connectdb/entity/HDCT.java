package com.example.connectdb.entity;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class HDCT {
    private static int nextId = 3; // Biến static để theo dõi ID tiếp theo
    private Integer id;
    @NotNull
    private Integer idHD;
    @NotNull
    private Integer idSPCT;
    @NotNull(message = "Số lượng không được trống")
    @Positive(message = "Số lượng phải là số dương")
    @Digits(integer = 3, fraction = 2, message = "Số lượng không được quá lớn")
    private Integer soLuong;
    @NotNull(message = "Đơn giá không được trống")
    @DecimalMin(value = "10", message = "Đơn giá phải lớn hơn 10")
    @Digits(integer = 3, fraction = 2, message = "Số lượng phải đúng định dạng")
    private Double donGia;
    private Double tongTien;
    @NotNull(message = "Trạng thái không được trống")
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
