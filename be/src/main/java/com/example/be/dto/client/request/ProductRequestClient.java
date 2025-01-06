package com.example.be.dto.client.request;

import com.example.be.entities.Category;
import com.example.be.entities.ProductDetail;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestClient {
    private Integer id;

    private String name;

    private Integer quantity;

    private String code;

    private Category category;

    private String status;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;

    private List<ProductDetail> listProductDetails;
}
