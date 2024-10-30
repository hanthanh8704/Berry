package com.example.be.services;//package com.example.be.services;

import com.example.be.dto.admin.request.promotion.PromotionRequest;
import com.example.be.entities.ProductDetail;
import com.example.be.entities.Promotion;
import com.example.be.utils.common.ResponseObject;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PromotionService {
    ResponseObject create(PromotionRequest request);
    ResponseObject update(Integer id,PromotionRequest request);

//    DotGiamGiaResponse getOne(Integer id);
    List<Integer> getListIdShoePromotion(Integer idPromotion);
    List<Integer> getListIdShoeDetailInPromotion(@Param("idPromotion") Integer idPromotion);
    void deleteAll(Integer idPromotion);
    void deletedDotGiamGia(Integer idDGG);
    void updateStatusPromotion();
    void updateStatusDotGiamGiaDetail();
    Promotion updateEndDate(Integer id);

    List<ProductDetail> SPCT(Integer idDGG);
}
