package com.example.connectdb.service.impl;

import com.example.connectdb.dto.request.size.KichCoRequest;
import com.example.connectdb.dto.response.KichCoResponse;
import com.example.connectdb.entity.KichCo;
import com.example.connectdb.repositories.KichCoRepository;
import com.example.connectdb.service.KichCoService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.converter.SizeConverter;
import com.example.connectdb.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class KichCoImpl implements KichCoService {
    private final KichCoRepository kichCoRepository;

    @Autowired
    public KichCoImpl(KichCoRepository kichCoRepository) {
        this.kichCoRepository = kichCoRepository;
    }

    @Autowired
    private SizeConverter sizeConverter;

    @Override
    public PageableObject<KichCoResponse> getAll(KichCoRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(kichCoRepository.findAllByCriteria(request, pageable));
    }




    @Override
    public KichCo getOne(Integer id) {
        return kichCoRepository.findById(id).orElse(null);
    }

    @Override
    public KichCo create(KichCoRequest request) {
        if (kichCoRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Kích cỡ " + request.getTen() + " đã tồn tại!");
        }
        KichCo size = sizeConverter.convertRequestToEntity(request);
        return kichCoRepository.save(size);
    }

    @Override
    public KichCo update(Integer id, KichCoRequest request) {
        KichCo oldSize = kichCoRepository.findById(id).get();
        if (kichCoRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldSize.getTen().equals(request.getTen())) {
                return kichCoRepository.save(sizeConverter.convertRequestToEntity(oldSize, request));
            }
            throw new RestApiException("Kích cỡ " + request.getTen() + " đã tồn tại!");
        } else {
            return kichCoRepository.save(sizeConverter.convertRequestToEntity(oldSize, request));
        }
    }


}
