package com.example.be.dto.admin.request.promotion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionRequest {
    private Integer id;

    private String code;

    private String name;

    private Integer discountPercentage;

    private String status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;

    private List<Integer> productDetails;
}
