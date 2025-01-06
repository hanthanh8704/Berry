package com.example.be.entities;


import com.example.be.utils.constant.StatusBill;
import com.example.be.utils.constant.StatusPayMents;
import com.example.be.utils.constant.TypeBill;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // Mã hóa đơn

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee; // Mã nhân viên

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer; // Thông tin khách hàng

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher; // Mã voucher giảm giá

    @Column(name = "code")
    private String code; // Mã hóa đơn
    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_type")
    private TypeBill invoiceType; // Loại hóa đơn (ví dụ: bán lẻ, bán buôn)

    @Column(name = "recipient_name")
    private String recipientName; // Tên người nhận

    @Column(name = "discount_amount")
    private BigDecimal discountAmount; // Số tiền giảm giá

    @Column(name = "total_money")
    private BigDecimal totalMoney; // Tổng tiền hóa đơn

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee; // Phí vận chuyển

    @Column(name = "recipient_email")
    private String recipientEmail; // Email người nhận

    @Column(name = "recipient_phone")
    private String recipientPhone; // Số điện thoại người nhận
    @Column(name = "address")
    private String address;
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "invoice_status")
    private StatusBill invoiceStatus; // Trạng thái hóa đơn (ví dụ: chưa thanh toán, đã thanh toán)

    @Column(name = "delivery_status")
    private String deliveryStatus; // Trạng thái giao hàng (ví dụ: đang giao, đã nhận)

    @CreationTimestamp
    @Column(name = "confirmation_date")
    private Timestamp confirmationDate; // Thời gian xác nhận

    @CreationTimestamp
    @Column(name = "delivery_date")
    private Timestamp deliveryDate; // Thời gian giao hàng

    @CreationTimestamp
    @Column(name = "shipping_time")
    private Timestamp shippingTime; // Thời gian vận chuyển

    @CreationTimestamp
    @Column(name = "received_date")
    private Timestamp receivedDate; // Thời gian nhận hàng
    @Column(name = "approval_date")
    private Timestamp approvalDate; // Ngày phê duyệt trả hàng

    @Column(name = "payment_status")
    @Enumerated(EnumType.STRING)
    private StatusPayMents paymentStatus;

    @Column(name = "note")
    private String note; // Ghi chú hóa đơn

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt; // Thời gian tạo hóa đơn

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật hóa đơn

    @Column(name = "created_by")
    private String createdBy; // Người tạo hóa đơn

    @Column(name = "updated_by")
    private String updatedBy; // Người cập nhật hóa đơn

    @Column(name = "deleted")
    private Boolean deleted; // Trạng thái xóa (true: đã xóa, false: chưa xóa)
}