package com.example.be.services;

import com.example.be.dto.admin.request.collar.CollarRequest;
import com.example.be.dto.admin.response.CollarResponse;
import com.example.be.entities.Collar;
import com.example.be.utils.common.PageableObject;

public interface CollarService {
    PageableObject<CollarResponse> getAll(CollarRequest request);

    Collar getOne(Integer id);

    Collar create(CollarRequest collarRequest);

    Collar update(Integer id, CollarRequest collarRequest);

    boolean existsByMaIgnoreCase(String ma); // Add if needed
}
