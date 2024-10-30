package com.example.be.entities;

import com.example.be.utils.constant.StatusBill;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
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
@Table(name = "bill_detail")
public class BillDetail {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;
    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    private ProductDetail productDetail;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "status")
    private StatusBill status;

    @CreationTimestamp // Ghi nhận thời gian tạo bản ghi tự động
    @CreatedDate // Đánh dấu trường này là ngày tạo
    @Column(name = "created_at", updatable = false) // Định nghĩa cột "created_at" trong bảng, không cho phép cập nhật
    private Timestamp createdAt; // Ngày tạo hóa đơn

    @UpdateTimestamp // Ghi nhận thời gian cập nhật bản ghi tự động
    @LastModifiedDate // Đánh dấu trường này là ngày cập nhật cuối cùng
    @Column(name = "updated_at") // Định nghĩa cột "updated_at" trong bảng
    private Timestamp updatedAt; // Ngày cập nhật hóa đơn

}
