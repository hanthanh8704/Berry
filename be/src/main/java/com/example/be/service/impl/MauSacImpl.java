package com.example.be.service.impl;

import com.example.be.dto.request.color.MauSacRequest;
import com.example.be.dto.request.color.MauSacSearchRequest;
import com.example.be.dto.response.MauSacResponse;
import com.example.be.entity.MauSac;
import com.example.be.repository.MauSacRepository;
import com.example.be.service.MauSacService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.ColorConverter;
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
public class MauSacImpl implements MauSacService {
    private final MauSacRepository mauSacRepository;

    @Autowired
    public MauSacImpl(MauSacRepository mauSacRepository) {
        this.mauSacRepository = mauSacRepository;
    }

    @Autowired
    private ColorConverter colorConverter;

    @Override
    public PageableObject<MauSacResponse> getAll(MauSacRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(mauSacRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public MauSac getOne(Integer id) {
        return mauSacRepository.findById(id).orElse(null);
    }

    @Override
    public MauSac create(MauSacRequest request) {
        if (mauSacRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Màu " + request.getTen() + " đã tồn tại!");
        }
        if(mauSacRepository.existsByCodeIgnoreCase(request.getCode())){
            throw new RestApiException("Màu " + request.getCode() + " đã tồn tại!");
        }
        MauSac color = colorConverter.convertRequestToEntity(request);
        return mauSacRepository.save(color);
    }

    @Override
    public MauSac update(Integer id, MauSacRequest request) {
        MauSac oldColor = mauSacRepository.findById(id).get();
        if (mauSacRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldColor.getTen().equals(request.getTen())) {
                return mauSacRepository.save(colorConverter.convertRequestToEntity(oldColor, request));
            }
            throw new RestApiException("Màu " + request.getTen() + " đã tồn tại!");
        } else {
            return mauSacRepository.save(colorConverter.convertRequestToEntity(oldColor, request));
        }
    }


}
