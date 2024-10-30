package com.example.be.services.impl;


import com.example.be.dto.admin.request.brand.BrandRequest;
import com.example.be.dto.admin.response.BrandResponse;
import com.example.be.entities.Brand;
import com.example.be.repositories.admin.BrandRepository;
import com.example.be.services.BrandService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.BrandConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BrandImpl implements BrandService {
    private final BrandRepository brandRepository;

    @Autowired
    public BrandImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Autowired
    private BrandConverter brandConverter;

    @Override
    public PageableObject<BrandResponse> getAll(BrandRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(brandRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Brand getOne(Integer id) {
        return brandRepository.findById(id).orElse(null);
    }

    @Override
    public Brand create(BrandRequest request) {
        if (brandRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Thương hiệu " + request.getName() + " đã tồn tại!");
        }
        Brand brand = brandConverter.convertRequestToEntity(request);
        return brandRepository.save(brand);
    }

    @Override
    public Brand update(Integer id, BrandRequest request) {
        Brand oldBrand = brandRepository.findById(id).orElse(null);
        if (brandRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldBrand != null && oldBrand.getName().equals(request.getName())) {
                return brandRepository.save(brandConverter.convertRequestToEntity(oldBrand, request));
            }
            throw new RestApiException("Thương hiệu " + request.getName() + " đã tồn tại!");
        } else {
            return oldBrand != null ? brandRepository.save(brandConverter.convertRequestToEntity(oldBrand, request)) : null;
        }
    }
}
