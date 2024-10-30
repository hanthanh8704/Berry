package com.example.be.dto.admin.request.bill;

import com.example.be.utils.constant.StatusBill;
import com.example.be.utils.constant.TypeBill;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class BillRequest {
    private Integer id; // Mã hóa đơn

    private Integer employeeId; // Mã nhân viên

    private Integer customerId; // Thông tin khách hàng

    private Integer voucherId; // Mã voucher giảm giá

    private String code; // Mã hóa đơn

    private TypeBill invoiceType; // Loại hóa đơn (ví dụ: bán lẻ, bán buôn)

    private String recipientName; // Tên người nhận

    private BigDecimal discountAmount; // Số tiền giảm giá

    private BigDecimal totalMoney; // Tổng tiền hóa đơn

    private BigDecimal shippingFee; // Phí vận chuyển

    private String recipientEmail; // Email người nhận

    private String recipientPhone; // Số điện thoại người nhận

    private String address; // Địa chỉ nhận hàng

    private StatusBill invoiceStatus; // Trạng thái hóa đơn (ví dụ: chưa thanh toán, đã thanh toán)

    private String deliveryStatus; // Trạng thái giao hàng (ví dụ: đang giao, đã nhận)

    private Timestamp confirmationDate; // Thời gian xác nhận

    private Timestamp deliveryDate; // Thời gian giao hàng

    private Timestamp shippingTime; // Thời gian vận chuyển

    private Timestamp receivedDate; // Thời gian nhận hàng

    private String paymentStatus; // Trạng thái thanh toán

    private String note; // Ghi chú hóa đơn

    private LocalDateTime createdAt; // Thời gian tạo hóa đơn

    private LocalDateTime updatedAt; // Thời gian cập nhật hóa đơn

    private String createdBy; // Người tạo hóa đơn

    private String updatedBy; // Người cập nhật hóa đơn

    private Boolean deleted; // Trạng thái xóa (true: đã xóa, false: chưa xóa)
    private Integer account;
    private Boolean choThanhToan;
    private String hinhThucThanhToan;
    private BigDecimal tienMat;
    private BigDecimal tienChuyenKhoan;

    private Boolean waitPay;
    private String TransactionNo;

    private List<CreatePaymentsMethodRequest> paymentsMethodRequests;
}
