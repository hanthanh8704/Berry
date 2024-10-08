package com.poly.backend.infrastructure.converter;

import com.poly.backend.dto.request.DotGiamGiaRequest;

import com.poly.backend.entity.English.Promotion;
import com.poly.backend.repository.DotGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DotGiamGiaConvert {
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

    public Promotion convertRequestToEntity(DotGiamGiaRequest request){
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

    public Promotion convertRequestToEntity(Promotion promotion, DotGiamGiaRequest request){
        promotion.setName(request.getName());
        promotion.setDiscountPercentage(request.getDiscountPercentage());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setStatus(request.getStatus());
        promotion.setDeleted(true);
        return promotion;
    }
}