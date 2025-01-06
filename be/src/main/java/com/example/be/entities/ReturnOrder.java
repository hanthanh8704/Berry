package com.example.be.entities;
import com.example.be.utils.constant.StatusBill;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.sql.Timestamp;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "return_order")
public class ReturnOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill; // Hóa đơn liên kết với đơn trả hàng

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee; // Nhân viên xử lý đơn trả hàng

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer; // Khách hàng yêu cầu trả hàng

    @Column(name = "reason")
    private String reason; // Lý do trả hàng

    @Column(name = "total_return_amount")
    private BigDecimal totalReturnAmount; // Tổng tiền được hoàn trả

    @Column(name = "request_date")
    private Timestamp requestDate; // Ngày yêu cầu trả hàng

    @Column(name = "approval_date")
    private Timestamp approvalDate; // Ngày phê duyệt trả hàng

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "status")
    private StatusBill status; // Trạng thái đơn trả hàng

    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt; // Thời gian tạo đơn trả hàng

    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Thời gian cập nhật cuối cùng của đơn trả hàng

    @Column(name = "created_by")
    private String createdBy; // Người tạo hóa đơn

    @Column(name = "updated_by")
    private String updatedBy; // Người cập nhật hóa đơn
}
