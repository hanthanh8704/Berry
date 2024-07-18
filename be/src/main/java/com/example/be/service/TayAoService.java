package com.example.connectdb.service;

import com.example.connectdb.dto.request.sleeve.TayAoRequest;
import com.example.connectdb.dto.response.TayAoReponse;
import com.example.connectdb.entity.TayAo;
import com.example.connectdb.util.common.PageableObject;

public interface TayAoService {
    PageableObject<TayAoReponse> getAll(TayAoRequest request);

    TayAo getOne(Integer id);

    TayAo create(TayAoRequest tayAoRequest);

    TayAo update(Integer id, TayAoRequest tayAoRequest);
}
