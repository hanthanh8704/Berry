package com.poly.backend.service;

import com.poly.backend.dto.request.DotGiamGiaRequest;
import com.poly.backend.dto.response.DotGiamGiaResponse;

import com.poly.backend.entity.English.ProductDetail;
import com.poly.backend.entity.English.Promotion;

import com.poly.backend.infrastructure.common.ResponseObject;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DotGiamGiaService {
//    PageableObject<PromotionResponse> getAll(PromotionRequest request);
    ResponseObject create(DotGiamGiaRequest request);
    ResponseObject update(Integer id,DotGiamGiaRequest request);
    DotGiamGiaResponse getOne(Integer id);
    List<Integer> getListIdShoePromotion(Integer idPromotion);
    List<Integer> getListIdShoeDetailInPromotion(@Param("idPromotion") Integer idPromotion);
    void deleteAll(Integer idPromotion);
    void deletedDotGiamGia(Integer idDGG);
    void updateStatusPromotion();
    void updateStatusDotGiamGiaDetail();
    Promotion updateEndDate(Integer id);

    List<ProductDetail> SPCT(Integer idDGG);
}
