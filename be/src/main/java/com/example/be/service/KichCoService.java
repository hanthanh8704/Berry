package com.example.be.service;

import com.example.be.dto.request.size.KichCoRequest;
import com.example.be.dto.response.KichCoResponse;
import com.example.be.entity.KichCo;
import com.example.be.util.common.PageableObject;

public interface KichCoService {
    PageableObject<KichCoResponse> getAll(KichCoRequest request);

    KichCo getOne(Integer id);

    KichCo create(KichCoRequest kichCoRequest);

    KichCo update(Integer id, KichCoRequest kichCoRequest);

}
