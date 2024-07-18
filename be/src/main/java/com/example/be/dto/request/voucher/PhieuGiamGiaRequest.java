package com.example.be.dto.request.voucher;

import com.example.be.util.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
/**
 * @author ninhncph40535
 *
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuGiamGiaRequest  extends PageableRequest {
    private Integer id;
    private String ma;

    //    @NotEmpty(message = "Tên không được để trống!")
    private String ten;

    //    @NotNull(message = "Số lượng không được để trống!")
//    @Min(value = 1, message = "Số lượng tối thiểu là 1")
//    @Max(value = 10000, message = "Số lượng tối đa là 10000")
//    @Digits(integer = 5, fraction = 0, message = "Số lượng phải là số và không có phần thập phân!")
    private Integer soLuong;

    //    @NotNull(message = "Ngày bắt đầu không được để trống!")
//    @Future(message = "Ngày bắt đầu phải lớn hơn ngày hiện tại")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime ngayBatDau;

    //    @NotNull(message = "Ngày kết thúc không được để trống!")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime ngayKetThuc;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayTao;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngaySua;

    private String trangThai;

    @NotNull(message = "Giá trị tối thiểu không được để trống!")
//    @DecimalMin(value = "0", message = "Giá trị tối thiểu là 0")
//    @DecimalMax(value = "1000000000000", message = "Giá trị tối thiểu tối đa là 1000.000.000.000")
//    @Digits(integer = 15, fraction = 2, message = "Giá trị tối thiểu phải là số và có tối đa 15 chữ số nguyên và 2 chữ số thập phân")
    private BigDecimal giaTriHoaDonDuocApDung;

    //    @NotNull(message = "Giá trị giảm không được để trống!")
//    @Digits(integer = 15, fraction = 2, message = "Giá trị giảm phải là số và có tối đa 15 chữ số nguyên và 2 chữ số thập phân")
    private BigDecimal giaTriHoaDonDuocGiam;

    //    @NotNull(message = "Hình thức giảm không được để trống!")
    private String hinhThucGiam;

    //    @NotNull(message = "Loại không được để trống!")
    private String loai;

    //    @NotNull(message = "Người tạo không được để trống!")
    private String nguoiTao;

    //    @NotNull(message = "Người sửa không được để trống!")
    private String nguoiSua;
    private List<Integer> customers;
    private Boolean deleted;

    public List<Integer> getCustomers() {
        return customers != null ? customers : Collections.emptyList();
    }
}
