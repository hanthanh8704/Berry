package com.example.be.utils.converter;

import com.example.be.dto.admin.request.promotion.PromotionRequest;
import com.example.be.entities.Promotion;
import com.example.be.repositories.admin.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PromotionConvert {
    @Autowired
    private PromotionRepository promotionRepository;

    public Promotion convertRequestToEntity(PromotionRequest request){
        return Promotion.builder()
                .code(request.getCode())
                .name(request.getName())
                .discountPercentage(request.getDiscountPercentage())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .deleted(true)
                .build();
    }

    public Promotion convertRequestToEntity(Promotion promotion, PromotionRequest request){
        promotion.setName(request.getName());
        promotion.setDiscountPercentage(request.getDiscountPercentage());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setStatus(request.getStatus());
        promotion.setDeleted(true);
        return promotion;
    }
}
