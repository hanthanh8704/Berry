package com.example.be.service.impl;


import com.example.be.dto.request.label.ThuongHieuRequest;

import com.example.be.dto.response.ThuongHieuResponse;
import com.example.be.entity.ThuongHieu;
import com.example.be.repository.ThuongHieuRepository;
import com.example.be.service.ThuongHieuService;
import com.example.be.util.common.PageableObject;

import com.example.be.util.converter.BrandConverter;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ThuongHieuImpl implements ThuongHieuService {
    private final ThuongHieuRepository thuongHieuRepository;

    @Autowired
    public ThuongHieuImpl(ThuongHieuRepository thuongHieuRepository) {
        this.thuongHieuRepository = thuongHieuRepository;
    }

    @Autowired
    private BrandConverter brandConverter;

    @Override
    public PageableObject<ThuongHieuResponse> getAll(ThuongHieuRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(thuongHieuRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public ThuongHieu getOne(Integer id) {
        return thuongHieuRepository.findById(id).orElse(null);
    }

    @Override
    public ThuongHieu create(ThuongHieuRequest request) {
        if (thuongHieuRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Thương hiệu " + request.getTen() + " đã tồn tại!");
        }
        ThuongHieu brand = brandConverter.convertRequestToEntity(request);
        return thuongHieuRepository.save(brand);
    }

    @Override
    public ThuongHieu update(Integer id, ThuongHieuRequest request) {
        ThuongHieu oldBrand = thuongHieuRepository.findById(id).orElse(null);
        if (thuongHieuRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldBrand != null && oldBrand.getTen().equals(request.getTen())) {
                return thuongHieuRepository.save(brandConverter.convertRequestToEntity(oldBrand, request));
            }
            throw new RestApiException("Thương hiệu " + request.getTen() + " đã tồn tại!");
        } else {
            return oldBrand != null ? thuongHieuRepository.save(brandConverter.convertRequestToEntity(oldBrand, request)) : null;
        }
    }
}
