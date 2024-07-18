package com.example.be.service.impl;

import com.example.be.dto.request.category.DanhMucRequest;

import com.example.be.dto.response.DanhMucResponse;
import com.example.be.entity.DanhMuc;
import com.example.be.repository.DanhMucRepository;
import com.example.be.service.DanhMucService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.CategoryConverter;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DanhMucImpl implements DanhMucService {
    private final DanhMucRepository danhMucRepository;

    @Autowired
    public DanhMucImpl(DanhMucRepository danhMucRepository) {
        this.danhMucRepository = danhMucRepository;
    }

    @Autowired
    private CategoryConverter categoryConverter;

    @Override
    public PageableObject<DanhMucResponse> getAll(DanhMucRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(danhMucRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public DanhMuc getOne(Integer id) {
        return danhMucRepository.findById(id).orElse(null);
    }

    @Override
    public DanhMuc create(DanhMucRequest request) {
        if (danhMucRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Danh mục " + request.getTen() + " đã tồn tại!");
        }
        DanhMuc category = categoryConverter.convertRequestToEntity(request);
        return danhMucRepository.save(category);
    }

    @Override
    public DanhMuc update(Integer id, DanhMucRequest request) {
        DanhMuc oldCategory = danhMucRepository.findById(id).get();
        if (danhMucRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldCategory.getTen().equals(request.getTen())) {
                return danhMucRepository.save(categoryConverter.convertRequestToEntity(oldCategory, request));
            }
            throw new RestApiException("Danh mục " + request.getTen() + " đã tồn tại!");
        } else {
            return danhMucRepository.save(categoryConverter.convertRequestToEntity(oldCategory, request));
        }
    }
}
