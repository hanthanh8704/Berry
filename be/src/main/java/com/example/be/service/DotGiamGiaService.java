package com.example.be.service;

import com.example.be.dto.request.dotgiamgia.DotGiamGiaRequest;
import com.example.be.dto.response.DotGiamGiaResponse;
import com.example.be.entity.DotGiamGia;
import com.example.be.entity.DotGiamGiaDetail;
import com.example.be.util.common.ResponseObject;
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
    void updateStatusPromotion();
    void updateStatusDotGiamGiaDetail();
    DotGiamGia updateEndDate(Integer id);

    List<DotGiamGiaDetail> DotGiamGiaDetail(Integer idDGG);
}
