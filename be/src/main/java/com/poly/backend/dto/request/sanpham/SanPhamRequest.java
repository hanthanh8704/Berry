package com.poly.backend.dto.request.sanpham;


import com.poly.backend.entity.English.Category;
import com.poly.backend.entity.English.ProductDetail;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamRequest {

    private Integer id;

    private String name;

    private Integer quantity;

    private String code;

    private Category category;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;

    private List<ProductDetail> listProductDetails;


}
