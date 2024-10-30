package com.example.be.dto.admin.response;

import com.example.be.entities.Bill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Projection(types = {Bill.class})
public interface HoaDonResponse {

    Integer getId();  // Mã hóa đơn

    String getCode();  // Mã hóa đơn (field "code" trong entity Bill)

    String getInvoiceType();  // Loại hóa đơn (Enum TypeBill)

    String getRecipientName();  // Tên người nhận

    BigDecimal getDiscountAmount();  // Số tiền giảm giá

    BigDecimal getTotalMoney();  // Tổng tiền hóa đơn

    BigDecimal getShippingFee();  // Phí vận chuyển

    String getRecipientEmail();  // Email người nhận

    String getRecipientPhone();  // Số điện thoại người nhận

    String getAddress();  // Địa chỉ giao hàng

    String getInvoiceStatus();  // Trạng thái hóa đơn (Enum StatusBill)

    String getDeliveryStatus();  // Trạng thái giao hàng

    Timestamp getDeliveryDate();  // Thời gian giao hàng

    Timestamp getReceivedDate();  // Thời gian nhận hàng

    String getNote();  // Ghi chú hóa đơn

    Timestamp getCreatedAt();  // Thời gian tạo hóa đơn

    Timestamp getUpdatedAt();  // Thời gian cập nhật hóa đơn

    String getCreatedBy();  // Người tạo hóa đơn

    String getUpdatedBy();  // Người cập nhật hóa đơn

    // Các thuộc tính liên quan đến liên kết với các thực thể khác:
    @Value("#{target.voucher != null ? target.voucher.code : null}")
    String getVoucher();  // Lấy mã voucher nếu có

    @Value("#{target.employee != null ? target.employee.name : null}")
    String getEmployee();  // Lấy tên nhân viên nếu có

    @Value("#{target.customer != null ? target.customer.name : null}")
    String getCustomer();  // Lấy tên khách hàng nếu có
}
