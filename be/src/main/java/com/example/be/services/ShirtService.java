package com.example.be.services;

import com.example.be.dto.admin.request.product.ShirtRequest;
import com.example.be.dto.admin.request.product.ShirtSearchRequest;
import com.example.be.dto.admin.response.ShirtReponse;
import com.example.be.utils.common.PageableObject;

import java.util.List;
import com.example.be.entities.*;
public interface ShirtService {
    boolean existsByTenIgnoreCase(String ten);
    PageableObject<ShirtReponse> getAll(ShirtSearchRequest request);
    Product getOne(Integer id);
    Product create(ShirtRequest request);
    Product update(Integer id, ShirtRequest request);
    Product changeStatus(Integer id);

    List<ShirtReponse> getTopSell(Integer top);

}
