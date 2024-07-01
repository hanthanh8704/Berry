package com.example.be.dto.response;

import com.example.be.entity.HoaDon;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;
/*
 * Projection là một cơ chế cho phép bạn xác định chính xác các trường dữ liệu mà bạn muốn trả về từ một entity khi nó được truy xuất thông qua REST API
 *
 * */
@Projection(types = {HoaDon.class})
public interface HoaDonResponse {
    @Value("#{target.indexs}")
    Integer getInteger();
    Integer getId();
    String getMa();
    String getLoaiHoaDon();
    String getTenNguoiNhan();
    BigDecimal getSoTienDuocGiam();
    BigDecimal getTongTien();
    BigDecimal getPhiShip();
    String getEmailNguoiNhan();
    String getSoDienThoaiNguoiNhan();
    String getTrangThaiHoaDon();
    String getTrangThaiGiaoHang();
    Timestamp getNgayGiaoHang();
    Integer getMaGiaoDich();
    Timestamp getNgayNhanHang();
    BigDecimal getTongTienSauGiamGia();
    String getDiaChi();
    String getGhiChu();
    Timestamp getNgayTao();
    Timestamp getNgaySua();
    String getNguoiTao();
    String getNguoiSua();
    // Add methods for fetching related entities if needed
    String getPhieuGiamGia();
    String getNhanVien(); // Example: Fetching tenNhanVien from NhanVien entity
    String getKhachHang(); // Example: Fetching tenKhachHang from KhachHang entity
}

/*
@Value("#{target.indexs}") Integer getIndex();: Lấy giá trị indexs từ thực thể Bill.
Long getId();: Lấy giá trị id từ thực thể Bill.
String getCode();: Lấy giá trị code từ thực thể Bill.
LocalDateTime getCreateAt();: Lấy giá trị createAt từ thực thể Bill.
String getEmployee();: Lấy thông tin nhân viên từ thực thể Bill (có thể là từ trường account).
String getCustomer();: Lấy thông tin khách hàng từ thực thể Bill (có thể là từ trường customer).
String getAddress();: Lấy giá trị address từ thực thể Bill.
String getPhoneNumber();: Lấy giá trị phoneNumber từ thực thể Bill.
BigDecimal getTotalMoney();: Lấy giá trị totalMoney từ thực thể Bill.
BigDecimal getMoneyShip();: Lấy giá trị moneyShip từ thực thể Bill.
BigDecimal getMoneyReduce();: Lấy giá trị moneyReduce từ thực thể Bill.
LocalDateTime getPayDate();: Lấy giá trị payDate từ thực thể Bill.
LocalDateTime getShipDate();: Lấy giá trị shipDate từ thực thể Bill.
LocalDateTime getDesiredDate();: Lấy giá trị desiredDate từ thực thể Bill.
Long getReceiveDate();: Lấy giá trị receiveDate từ thực thể Bill.
Integer getType();: Lấy giá trị type từ thực thể Bill.
Integer getStatus();: Lấy giá trị status từ thực thể Bill.
String getVoucher();: Lấy giá trị từ trường voucher của thực thể Bill.
String getNote();: Lấy giá trị note từ thực thể Bill.
 */
