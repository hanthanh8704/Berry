package com.example.be.service;

import com.example.be.dto.request.collar.CoAoRequest;
import com.example.be.dto.response.CoAoResponse;
import com.example.be.entity.CoAo;
import com.example.be.util.common.PageableObject;

public interface CoAoService {
    PageableObject<CoAoResponse> getAll(CoAoRequest request);

    CoAo getOne(Integer id);

    CoAo create(CoAoRequest coAoRequest);

    CoAo update(Integer id, CoAoRequest coAoRequest);

    boolean existsByMaIgnoreCase(String ma); // Add if needed
}
