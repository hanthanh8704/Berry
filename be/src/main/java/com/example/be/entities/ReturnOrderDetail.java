package com.example.be.entities;
import com.example.be.utils.constant.StatusReturnOrder;
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
@Table(name = "return_order_detail")
public class ReturnOrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id; // ID duy nhất cho chi tiết đơn trả hàng

    @ManyToOne
    @JoinColumn(name = "return_order_id")
    private ReturnOrder returnOrder; // Đơn trả hàng liên kết với chi tiết này

    @ManyToOne
    @JoinColumn(name = "product_detail_id")
    private ProductDetail productDetail; // Thông tin chi tiết sản phẩm được trả

    @Column(name = "quantity")
    private Integer quantity; // Số lượng sản phẩm trả lại

    @Column(name = "price")
    private BigDecimal price; // Giá sản phẩm tại thời điểm trả hàng

    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt; // Ngày tạo bản ghi chi tiết đơn trả hàng

    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private Timestamp updatedAt; // Ngày cập nhật cuối cùng của bản ghi chi tiết
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusReturnOrder status;
}
