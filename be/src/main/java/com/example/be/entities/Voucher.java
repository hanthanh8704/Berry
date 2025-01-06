package com.example.be.entities;

import com.example.be.utils.constant.MethodVoucher;
import com.example.be.utils.constant.VoucherConstant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "created_at")
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Timestamp updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VoucherConstant status;

    @Column(name = "minimum_order_value")
    private BigDecimal minOrderValue;
    @Column(name = "maximum_discount_value")
    private BigDecimal maxDiscountValue;

    @Column(name = "discount_value")
    private BigDecimal discountValue;

    @Column(name = "discount_method")
    @Enumerated(EnumType.STRING)
    private MethodVoucher discountMethod;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private VoucherConstant type;
    @Column(name = "deleted")
    private Boolean deleted;
}
