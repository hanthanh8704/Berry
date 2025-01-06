package com.example.be.services;

import com.example.be.dto.admin.request.size.SizeRequest;
import com.example.be.dto.admin.response.SizeResponse;
import com.example.be.entities.Size;
import com.example.be.utils.common.PageableObject;

public interface SizeService {
    PageableObject<SizeResponse> getAll(SizeRequest request);

    Size getOne(Integer id);

    Size create(SizeRequest sizeRequest);

    Size update(Integer id, SizeRequest sizeRequest);

}
