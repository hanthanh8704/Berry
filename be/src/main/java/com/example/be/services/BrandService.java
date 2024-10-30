package com.example.be.services;

import com.example.be.dto.admin.request.brand.BrandRequest;
import com.example.be.dto.admin.response.BrandResponse;
import com.example.be.entities.Brand;
import com.example.be.utils.common.PageableObject;

public interface BrandService {
    PageableObject<BrandResponse> getAll(BrandRequest request);

    Brand getOne(Integer id);

    Brand create(BrandRequest thuongHieuRequest);

    Brand update(Integer id, BrandRequest thuongHieuRequest);
}
