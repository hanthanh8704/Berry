package com.example.be.service;

import com.example.be.dto.request.sleeve.TayAoRequest;
import com.example.be.dto.response.TayAoReponse;
import com.example.be.entity.TayAo;
import com.example.be.util.common.PageableObject;

public interface TayAoService {
    PageableObject<TayAoReponse> getAll(TayAoRequest request);

    TayAo getOne(Integer id);

    TayAo create(TayAoRequest tayAoRequest);

    TayAo update(Integer id, TayAoRequest tayAoRequest);
}
