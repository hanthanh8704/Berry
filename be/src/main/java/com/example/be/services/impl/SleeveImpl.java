package com.example.be.services.impl;

import com.example.be.dto.admin.request.sleeve.SleeveRequest;
import com.example.be.dto.admin.response.SleeveReponse;
import com.example.be.entities.Sleeve;
import com.example.be.repositories.admin.SleeveRepository;
import com.example.be.services.SleeveService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.SleeveConverter;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SleeveImpl implements SleeveService {
    private final SleeveRepository sleeveRepository;
    private final SleeveConverter tayAoConverter;

    @Autowired
    public SleeveImpl(SleeveRepository sleeveRepository, SleeveConverter tayAoConverter) {
        this.sleeveRepository = sleeveRepository;
        this.tayAoConverter = tayAoConverter;
    }

    @Override
    public PageableObject<SleeveReponse> getAll(SleeveRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(sleeveRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Sleeve getOne(Integer id) {
        return sleeveRepository.findById(id).orElse(null);
    }

    @Override
    public Sleeve create(SleeveRequest request) {
        if (sleeveRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Tay áo " + request.getName() + " đã tồn tại!");
        }
        Sleeve tayAo = tayAoConverter.convertRequestToEntity(request);
        return sleeveRepository.save(tayAo);
    }

    @Override
    public Sleeve update(Integer id, SleeveRequest request) {
        Sleeve oldTayAo = sleeveRepository.findById(id).orElse(null);
        if (oldTayAo == null) {
            throw new RestApiException("Không tìm thấy tay áo với ID " + id);
        }
        if (sleeveRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldTayAo.getName().equals(request.getName())) {
                return sleeveRepository.save(tayAoConverter.convertRequestToEntity(oldTayAo, request));
            }
            throw new RestApiException("Tay áo " + request.getName() + " đã tồn tại!");
        } else {
            return sleeveRepository.save(tayAoConverter.convertRequestToEntity(oldTayAo, request));
        }
    }
}
