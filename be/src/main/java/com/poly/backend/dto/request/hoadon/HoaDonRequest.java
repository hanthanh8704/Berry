package com.poly.backend.dto.request.hoadon;


import com.poly.backend.entity.English.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonRequest {

    private Integer id; // Mã định danh duy nhất của hóa đơn

    private Employee employee; // Nhân viên tạo hóa đơn

    private Voucher voucher; // Phiếu giảm giá áp dụng cho hóa đơn

    //    private Customer customer; // Khách hàng mua hàng
    private Integer customerId;
    private List<Bill_history> billHistory;
    private String code; // Mã hóa đơn

    private TypeBill invoiceType; // Loại hóa đơn (ví dụ: điện tử, giấy)

    private String recipientName; // Tên người nhận hàng

    private BigDecimal discountAmount; // Số tiền giảm giá áp dụng cho hóa đơn

    private BigDecimal totalMoney; // Tổng tiền của hóa đơn

    private BigDecimal shippingFee; // Phí vận chuyển

    private String recipientEmail; // Email của người nhận hàng

    private String recipientPhone; // Số điện thoại của người nhận hàng

    private StatusBil invoiceStatus; // Trạng thái của hóa đơn (ví dụ: đang xử lý, đã hoàn thành)

    private String deliveryStatus; // Trạng thái giao hàng (ví dụ: đang giao, đã giao)
    private String note;
    private Timestamp confirmationDate; // Ngày xác nhận hóa đơn

    private Timestamp deliveryDate; // Ngày giao hàng

    private Timestamp shippingTime; // Thời gian vận chuyển

    private Timestamp receivedDate; // Ngày người nhận hàng đã nhận được

    private String paymentStatus; // Trạng thái thanh toán (ví dụ: đã thanh toán, chưa thanh toán)
    private String transactionNo;
    private String address;
    private LocalDateTime createdAt; // Ngày tạo hóa đơn

    private LocalDateTime updatedAt; // Ngày cập nhật hóa đơn

    private String createdBy; // Người tạo hóa đơn
    private String updatedBy; // Người cập nhật hóa đơn

    private Boolean deleted; // Trạng thái đã bị xóa hay chưa (true: đã xóa, false: chưa xóa)

    private List<Bill_detail> billDetails;

    private List<Integer> idSPCTs;
    private Integer paymentId;

}
