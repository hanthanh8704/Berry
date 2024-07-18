package com.example.be.service.impl;

import com.example.be.dto.request.sleeve.TayAoRequest;
import com.example.be.dto.response.TayAoReponse;
import com.example.be.entity.TayAo;
import com.example.be.repository.TayAoRepository;
import com.example.be.service.TayAoService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.SleeveConverter;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TayAoImpl implements TayAoService {
    private final TayAoRepository tayAoRepository;
    private final SleeveConverter tayAoConverter;

    @Autowired
    public TayAoImpl(TayAoRepository tayAoRepository, SleeveConverter tayAoConverter) {
        this.tayAoRepository = tayAoRepository;
        this.tayAoConverter = tayAoConverter;
    }

    @Override
    public PageableObject<TayAoReponse> getAll(TayAoRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(tayAoRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public TayAo getOne(Integer id) {
        return tayAoRepository.findById(id).orElse(null);
    }

    @Override
    public TayAo create(TayAoRequest request) {
        if (tayAoRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Tay áo " + request.getTen() + " đã tồn tại!");
        }
        TayAo tayAo = tayAoConverter.convertRequestToEntity(request);
        return tayAoRepository.save(tayAo);
    }

    @Override
    public TayAo update(Integer id, TayAoRequest request) {
        TayAo oldTayAo = tayAoRepository.findById(id).orElse(null);
        if (oldTayAo == null) {
            throw new RestApiException("Không tìm thấy tay áo với ID " + id);
        }
        if (tayAoRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldTayAo.getTen().equals(request.getTen())) {
                return tayAoRepository.save(tayAoConverter.convertRequestToEntity(oldTayAo, request));
            }
            throw new RestApiException("Tay áo " + request.getTen() + " đã tồn tại!");
        } else {
            return tayAoRepository.save(tayAoConverter.convertRequestToEntity(oldTayAo, request));
        }
    }
}
