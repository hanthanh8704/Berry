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
@Table(name = "voucher")
public class Voucher {
    @Id // Khóa chính
    @Column(name = "id") // Cột ID
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID
    private Integer id; // Mã định danh của phiếu giảm giá

    @Column(name = "code") // Cột mã phiếu giảm giá
    private String code; // Mã phiếu giảm giá

    @Column(name = "name") // Cột tên phiếu giảm giá
    private String name; // Tên phiếu giảm giá

    @Column(name = "quantity") // Cột số lượng phiếu giảm giá
    private Integer quantity; // Số lượng phiếu giảm giá có sẵn

    @Column(name = "type") // Cột loại phiếu giảm giá
    private String type; // Loại phiếu giảm giá (ví dụ: phần trăm, tiền mặt)

    @Column(name = "start_date") // Cột ngày bắt đầu
    private LocalDateTime startDate; // Ngày bắt đầu hiệu lực của phiếu giảm giá

    @Column(name = "end_date") // Cột ngày kết thúc
    private LocalDateTime endDate; // Ngày kết thúc hiệu lực của phiếu giảm giá

    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;// Ngày cập nhật thông tin phiếu giảm giá

    @Column(name = "status") // Cột trạng thái
    private String status; // Trạng thái của phiếu giảm giá (ví dụ: hoạt động, hết hạn)

    @Column(name = "minimum_order_value") // Cột giá trị đơn hàng tối thiểu
    private BigDecimal minimumOrderValue; // Giá trị đơn hàng tối thiểu để sử dụng phiếu giảm giá

    @Column(name = "maximum_discount_value") // Cột giá trị giảm giá tối đa
    private BigDecimal maximumDiscountValue; // Giá trị giảm giá tối đa mà phiếu có thể áp dụng

    @Column(name = "discount_value") // Cột giá trị giảm giá
    private BigDecimal discountValue; // Giá trị giảm giá cụ thể của phiếu

    @Column(name = "discount_method") // Cột phương pháp giảm giá
    private String discountMethod; // Phương pháp áp dụng giảm giá (ví dụ: trực tiếp, theo phần trăm)

    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "deleted") // Cột trạng thái xóa
    private Boolean deleted; // Trạng thái đã bị xóa hay chưa (true: đã xóa, false: chưa xóa)

}
