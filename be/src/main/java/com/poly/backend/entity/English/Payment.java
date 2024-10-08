package com.poly.backend.entity.English;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
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
@Table(name = "payment")
public class Payment {
    // Trường ID là khóa chính, giá trị sẽ tự động tăng khi tạo mới bản ghi
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // Liên kết nhiều-nhiều với bảng Bill, khóa ngoại tham chiếu đến trường bill_id
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;

    // Liên kết nhiều-nhiều với bảng Employee, khóa ngoại tham chiếu đến trường employee_id
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // Phương thức thanh toán (ví dụ: tiền mặt, thẻ tín dụng, v.v.)
    @Column(name = "method")
    private String method;

    // Mã giao dịch của khoản thanh toán
    @Column(name = "transaction_no")
    private String transactionNo;

    // Ngày thực hiện giao dịch thanh toán
    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    // Tổng số tiền thanh toán
    @Column(name = "total_money")
    private BigDecimal totalMoney;

    // Trạng thái thanh toán (ví dụ: đã hoàn thành, đang chờ, v.v.)
    @Column(name = "status")
    private String status;

    // Thời gian tạo bản ghi, tự động cập nhật khi bản ghi được tạo
    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


}
