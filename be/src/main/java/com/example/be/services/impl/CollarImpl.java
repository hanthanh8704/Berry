package com.example.be.services.impl;

import com.example.be.dto.admin.request.collar.CollarRequest;
import com.example.be.dto.admin.response.CollarResponse;
import com.example.be.entities.Collar;
import com.example.be.repositories.admin.CollarRepository;
import com.example.be.services.CollarService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.CollarConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CollarImpl implements CollarService {
    private final CollarRepository collarRepository;
    private final CollarConverter collarConverter;

    @Autowired
    public CollarImpl(CollarRepository collarRepository, CollarConverter collarConverter) {
        this.collarRepository = collarRepository;
        this.collarConverter = collarConverter;
    }

    @Override
    public PageableObject<CollarResponse> getAll(CollarRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(collarRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Collar getOne(Integer id) {
        return collarRepository.findById(id).orElse(null);
    }

    @Override
    public Collar create(CollarRequest request) {
        if (collarRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Cổ áo " + request.getName() + " đã tồn tại!");
        }
        Collar coAo = collarConverter.convertRequestToEntity(request);
        return collarRepository.save(coAo);
    }

    @Override
    public Collar update(Integer id, CollarRequest request) {
        Collar oldCoAo = collarRepository.findById(id).orElse(null);
        if (oldCoAo == null) {
            throw new RestApiException("Không tìm thấy cổ áo với ID " + id);
        }
        if (collarRepository.existsByNameIgnoreCase(request.getName()) && !oldCoAo.getName().equalsIgnoreCase(request.getName())) {
            throw new RestApiException("Cổ áo " + request.getName() + " đã tồn tại!");
        }
        return collarRepository.save(collarConverter.convertRequestToEntity(oldCoAo, request));
    }

    @Override
    public boolean existsByMaIgnoreCase(String ma) {
        return collarRepository.existsByNameIgnoreCase(ma);
    }
}
