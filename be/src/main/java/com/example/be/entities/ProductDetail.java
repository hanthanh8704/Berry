package com.example.be.entities;


import com.example.be.utils.constant.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "product_detail")
public class ProductDetail {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Hoặc một chiến lược khác phù hợp
    private Integer id;

    @OneToMany(mappedBy = "productDetail", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Image> images;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "sleeve_id")
    private Sleeve sleeve;

    @ManyToOne
    @JoinColumn(name = "collar_id")
    private Collar collar;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "detail_code")
    private String detailCode;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;


    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @Column(name = "weight")
    private Float weight;


    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;
    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "deleted")
    private Boolean deleted;
    @Column(name = "quantity_error")
    private Integer quantityError;

}
