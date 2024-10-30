package com.example.be.services;

import com.example.be.dto.admin.request.material.MaterialRequest;
import com.example.be.dto.admin.response.MaterialResponse;
import com.example.be.entities.Material;
import com.example.be.utils.common.PageableObject;

public interface MaterialService {
    PageableObject<MaterialResponse> getAll(MaterialRequest request);

    Material getOne(Integer id);

    Material create(MaterialRequest materialRequest);

    Material update(Integer id, MaterialRequest materialRequest);
}
