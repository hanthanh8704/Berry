package com.poly.backend.entity.English;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "bill")
public class Bill {
    @Id // Khóa chính của bảng
    @Column(name = "id") // Định nghĩa cột "id" trong bảng
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng giá trị của trường "id"
    private Integer id; // Mã định danh duy nhất của hóa đơn

    @ManyToOne // Mối quan hệ nhiều-đến-một với bảng Employee
    @JoinColumn(name = "employee_id") // Định nghĩa khóa ngoại "employee_id" liên kết với bảng Employee
    private Employee employee; // Nhân viên tạo hóa đơn

    @ManyToOne // Mối quan hệ nhiều-đến-một với bảng Voucher
    @JoinColumn(name = "voucher_id") // Định nghĩa khóa ngoại "voucher_id" liên kết với bảng Voucher
    private Voucher voucher; // Phiếu giảm giá áp dụng cho hóa đơn

    @ManyToOne // Mối quan hệ nhiều-đến-một với bảng Customer
    @JoinColumn(name = "customer_id") // Định nghĩa khóa ngoại "customer_id" liên kết với bảng Customer
    private Customer customer; // Khách hàng mua hàng

    @Column(name = "code") // Định nghĩa cột "code" trong bảng
    private String code; // Mã hóa đơn
    @Column(name = "address") // Định nghĩa cột "code" trong bảng
    private String address; // Mã hóa đơ
    @Column(name = "invoice_type") // Định nghĩa cột "invoice_type" trong bảng
    @Enumerated(EnumType.STRING)
    private TypeBill invoiceType; // Loại hóa đơn (ví dụ: điện tử, giấy)

    @Column(name = "recipient_name") // Định nghĩa cột "recipient_name" trong bảng
    private String recipientName; // Tên người nhận hàng

    @Column(name = "discount_amount") // Định nghĩa cột "discount_amount" trong bảng
    private BigDecimal discountAmount; // Số tiền giảm giá áp dụng cho hóa đơn

    @Column(name = "total_money") // Định nghĩa cột "total_money" trong bảng
    private BigDecimal totalMoney; // Tổng tiền của hóa đơn

    @Column(name = "shipping_fee") // Định nghĩa cột "shipping_fee" trong bảng
    private BigDecimal shippingFee; // Phí vận chuyển

    @Column(name = "recipient_email") // Định nghĩa cột "recipient_email" trong bảng
    private String recipientEmail; // Email của người nhận hàng
    @Column(name = "note") //
    private String note; //
    @Column(name = "recipient_phone", length = 20)
    // Định nghĩa cột "recipient_phone" trong bảng với độ dài tối đa 20 ký tự
    private String recipientPhone; // Số điện thoại của người nhận hàng

    @Column(name = "invoice_status") // Định nghĩa cột "invoice_status" trong bảng
    private StatusBil invoiceStatus; // Trạng thái của hóa đơn (ví dụ: đang xử lý, đã hoàn thành)

    @Column(name = "delivery_status") // Định nghĩa cột "delivery_status" trong bảng
    private String deliveryStatus; // Trạng thái giao hàng (ví dụ: đang giao, đã giao)

    @Column(name = "confirmation_date") // Định nghĩa cột "confirmation_date" trong bảng
    private Timestamp confirmationDate; // Ngày xác nhận hóa đơn

    @Column(name = "delivery_date") // Định nghĩa cột "delivery_date" trong bảng
    private Timestamp deliveryDate; // Ngày giao hàng

    @Column(name = "shipping_time") // Định nghĩa cột "shipping_time" trong bảng
    private Timestamp shippingTime; // Thời gian vận chuyển

    @Column(name = "received_date") // Định nghĩa cột "received_date" trong bảng
    private Timestamp receivedDate; // Ngày người nhận hàng đã nhận được

    @Column(name = "payment_status") // Định nghĩa cột "payment_status" trong bảng
    private String paymentStatus; // Trạng thái thanh toán (ví dụ: đã thanh toán, chưa thanh toán)

    @CreationTimestamp // Ghi nhận thời gian tạo bản ghi tự động
    @CreatedDate // Đánh dấu trường này là ngày tạo
    @Column(name = "created_at", updatable = false) // Định nghĩa cột "created_at" trong bảng, không cho phép cập nhật
    private LocalDateTime createdAt; // Ngày tạo hóa đơn

    @UpdateTimestamp // Ghi nhận thời gian cập nhật bản ghi tự động
    @LastModifiedDate // Đánh dấu trường này là ngày cập nhật cuối cùng
    @Column(name = "updated_at") // Định nghĩa cột "updated_at" trong bảng
    private LocalDateTime updatedAt; // Ngày cập nhật hóa đơn

    @CreatedBy // Đánh dấu trường này là người tạo bản ghi
    @Column(name = "created_by") // Định nghĩa cột "created_by" trong bảng
    private String createdBy; // Người tạo hóa đơn

    @LastModifiedBy // Đánh dấu trường này là người cập nhật bản ghi cuối cùng
    @Column(name = "updated_by") // Định nghĩa cột "updated_by" trong bảng
    private String updatedBy; // Người cập nhật hóa đơn

    @Column(name = "deleted") // Định nghĩa cột "deleted" trong bảng
    private Boolean deleted; // Trạng thái đã bị xóa hay chưa (true: đã xóa, false: chưa xóa)

}
