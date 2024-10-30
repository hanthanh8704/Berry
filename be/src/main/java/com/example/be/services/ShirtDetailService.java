package com.example.be.services;
import com.example.be.entities.*;
import com.example.be.dto.admin.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.ShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.UpdateShirtDetailRequest;
import com.example.be.dto.admin.response.ShirtDetailResponse;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import com.example.be.entities.*;
public interface ShirtDetailService {
    PageableObject<ShirtDetailResponse> getAll(FindShirtDetailRequest request);

    ProductDetail getOne(Integer id);

    String create(List<ShirtDetailRequest> list);

    ProductDetail update(Integer id, UpdateShirtDetailRequest request);

    ProductDetail delete(Integer id);

    ResponseObject updateFast(List<ShirtDetailRequest> list);

    Map<String, BigDecimal> findMinAndMaxPrice();

    ShirtDetailResponse getOneShoeDetail(Integer id);
}
