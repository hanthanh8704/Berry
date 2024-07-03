package com.example.connectdb.service;

import com.example.connectdb.dto.request.collar.CoAoRequest;
import com.example.connectdb.dto.response.CoAoResponse;
import com.example.connectdb.entity.CoAo;
import com.example.connectdb.util.common.PageableObject;

public interface CoAoService {
    PageableObject<CoAoResponse> getAll(CoAoRequest request);

    CoAo getOne(Integer id);

    CoAo create(CoAoRequest coAoRequest);

    CoAo update(Integer id, CoAoRequest coAoRequest);

    boolean existsByMaIgnoreCase(String ma); // Add if needed
}
