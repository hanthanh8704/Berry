package com.example.connectdb.service;

import com.example.connectdb.dto.request.size.KichCoRequest;
import com.example.connectdb.dto.response.KichCoResponse;
import com.example.connectdb.entity.KichCo;
import com.example.connectdb.util.common.PageableObject;

public interface KichCoService {
    PageableObject<KichCoResponse> getAll(KichCoRequest request);
    KichCo findByMa(String ma);
    KichCo getOne(Integer id);
    KichCo create(KichCoRequest kichCoRequest);
    KichCo update(Integer id, KichCoRequest kichCoRequest);
}
