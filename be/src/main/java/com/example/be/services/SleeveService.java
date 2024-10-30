package com.example.be.services;

import com.example.be.dto.admin.request.sleeve.SleeveRequest;
import com.example.be.dto.admin.response.SleeveReponse;
import com.example.be.entities.Sleeve;
import com.example.be.utils.common.PageableObject;

public interface SleeveService {
    PageableObject<SleeveReponse> getAll(SleeveRequest request);

    Sleeve getOne(Integer id);

    Sleeve create(SleeveRequest sleeveRequest);

    Sleeve update(Integer id, SleeveRequest sleeveRequest);
}
