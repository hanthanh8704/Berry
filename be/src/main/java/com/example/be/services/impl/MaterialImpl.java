package com.example.be.services.impl;

import com.example.be.dto.admin.request.material.MaterialRequest;
import com.example.be.dto.admin.response.MaterialResponse;
import com.example.be.entities.Material;
import com.example.be.repositories.admin.MaterialRepository;
import com.example.be.services.MaterialService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.MaterialConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MaterialImpl implements MaterialService {
    private final MaterialRepository materialRepository;

    @Autowired
    private MaterialConverter materialConverter;

    @Autowired
    public MaterialImpl(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Override
    public PageableObject<MaterialResponse> getAll(MaterialRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(materialRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Material getOne(Integer id) {
        return materialRepository.findById(id).orElse(null);
    }

    @Override
    public Material create(MaterialRequest request) {
        if (materialRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Màu " + request.getName() + " đã tồn tại!");
        }
        Material chatLieu = materialConverter.convertRequestToEntity(request);
        return materialRepository.save(chatLieu);
    }

    @Override
    public Material update(Integer id, MaterialRequest request) {
        Material oldColor = materialRepository.findById(id).get();
        if (materialRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldColor.getName().equals(request.getName())) {
                return materialRepository.save(materialConverter.convertRequestToEntity(oldColor, request));
            }
            throw new RestApiException("Màu " + request.getName() + " đã tồn tại!");
        } else {
            return materialRepository.save(materialConverter.convertRequestToEntity(oldColor, request));
        }
    }
}
