package com.example.connectdb.service.impl;

import com.example.connectdb.dto.request.collar.CoAoRequest;
import com.example.connectdb.dto.response.CoAoResponse;
import com.example.connectdb.entity.CoAo;
import com.example.connectdb.repositories.CoAoRepository;
import com.example.connectdb.service.CoAoService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.converter.CollarConverter;
import com.example.connectdb.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CoAoImpl implements CoAoService {
    private final CoAoRepository coAoRepository;
    private final CollarConverter collarConverter;

    @Autowired
    public CoAoImpl(CoAoRepository coAoRepository, CollarConverter collarConverter) {
        this.coAoRepository = coAoRepository;
        this.collarConverter = collarConverter;
    }

    @Override
    public PageableObject<CoAoResponse> getAll(CoAoRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(coAoRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public CoAo getOne(Integer id) {
        return coAoRepository.findById(id).orElse(null);
    }

    @Override
    public CoAo create(CoAoRequest request) {
        if (coAoRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Cổ áo " + request.getTen() + " đã tồn tại!");
        }
        CoAo coAo = collarConverter.convertRequestToEntity(request);
        return coAoRepository.save(coAo);
    }

    @Override
    public CoAo update(Integer id, CoAoRequest request) {
        CoAo oldCoAo = coAoRepository.findById(id).orElse(null);
        if (oldCoAo == null) {
            throw new RestApiException("Không tìm thấy cổ áo với ID " + id);
        }
        if (coAoRepository.existsByTenIgnoreCase(request.getTen()) && !oldCoAo.getTen().equalsIgnoreCase(request.getTen())) {
            throw new RestApiException("Cổ áo " + request.getTen() + " đã tồn tại!");
        }
        return coAoRepository.save(collarConverter.convertRequestToEntity(oldCoAo, request));
    }

    @Override
    public boolean existsByMaIgnoreCase(String ma) {
        return coAoRepository.existsByTenIgnoreCase(ma);
    }
}
