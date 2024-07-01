package com.example.be.service.impl;

import com.example.be.dto.request.customer.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.KhachHang;
import com.example.be.repository.KhachHangRepository;
import com.example.be.service.KhachHangService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class KhachHangImpl implements KhachHangService {
    @Autowired
    private KhachHangRepository accountRepository;

    @Override
    public PageableObject<KhachHangResponse> getAll(KhachHangRequest request) {
        Pageable pageable = PageRequest.of(request.getPage()-1, request.getSizePage());
        return new PageableObject<>(accountRepository.getAll(request, pageable));
    }

    @Override
    public KhachHang getOne(Integer id) {
        return accountRepository.getOne(id);
    }

    @Override
    public KhachHang create(KhachHangRequest request) {
        return null;
    }

    @Override
    public KhachHang update(Integer id, KhachHangRequest request) {
        return null;
    }

    @Override
    public KhachHang delete(Integer id) {
        return null;
    }
}
