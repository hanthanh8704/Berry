package com.poly.backend.entity.English;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "bill_detail")
public class Bill_detail {
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
    private Integer status;

    @CreationTimestamp // Ghi nhận thời gian tạo bản ghi tự động
    @CreatedDate // Đánh dấu trường này là ngày tạo
    @Column(name = "created_at", updatable = false) // Định nghĩa cột "created_at" trong bảng, không cho phép cập nhật
    private LocalDateTime createdAt; // Ngày tạo hóa đơn

    @UpdateTimestamp // Ghi nhận thời gian cập nhật bản ghi tự động
    @LastModifiedDate // Đánh dấu trường này là ngày cập nhật cuối cùng
    @Column(name = "updated_at") // Định nghĩa cột "updated_at" trong bảng
    private LocalDateTime updatedAt; // Ngày cập nhật hóa đơn
}
