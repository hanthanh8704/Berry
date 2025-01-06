package com.example.be.services;

import com.example.be.dto.admin.request.color.ColorRequest;
import com.example.be.dto.admin.response.ColorResponse;
import com.example.be.entities.Color;
import com.example.be.utils.common.PageableObject;

public interface ColorService {
    PageableObject<ColorResponse> getAll(ColorRequest request);

    Color getOne(Integer id);

    Color create(ColorRequest colorRequest);

    Color update(Integer id, ColorRequest colorRequest);


}
