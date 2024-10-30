package com.example.be.services.impl;

import com.example.be.dto.admin.request.size.SizeRequest;
import com.example.be.dto.admin.response.SizeResponse;
import com.example.be.entities.Size;
import com.example.be.repositories.admin.SizeRepository;
import com.example.be.services.SizeService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.SizeConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SizeImpl implements SizeService {
    private final SizeRepository sizeRepository;

    @Autowired
    public SizeImpl(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    @Autowired
    private SizeConverter sizeConverter;

    @Override
    public PageableObject<SizeResponse> getAll(SizeRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(sizeRepository.findAllByCriteria(request, pageable));
    }




    @Override
    public Size getOne(Integer id) {
        return sizeRepository.findById(id).orElse(null);
    }

    @Override
    public Size create(SizeRequest request) {
        if (sizeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Kích cỡ " + request.getName() + " đã tồn tại!");
        }
        Size size = sizeConverter.convertRequestToEntity(request);
        return sizeRepository.save(size);
    }

    @Override
    public Size update(Integer id, SizeRequest request) {
        Size oldSize = sizeRepository.findById(id).get();
        if (sizeRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldSize.getName().equals(request.getName())) {
                return sizeRepository.save(sizeConverter.convertRequestToEntity(oldSize, request));
            }
            throw new RestApiException("Kích cỡ " + request.getName() + " đã tồn tại!");
        } else {
            return sizeRepository.save(sizeConverter.convertRequestToEntity(oldSize, request));
        }
    }


}
