package com.poly.backend.infrastructure.converter;

import com.poly.backend.dto.client.request.GioHangRequest;
import com.poly.backend.dto.request.DotGiamGiaRequest;

import com.poly.backend.entity.English.Cart;

import com.poly.backend.repository.DotGiamGiaRepository;
import com.poly.backend.repository.client.GioHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class GioHangConvert {
    @Autowired
    private GioHangRepository gioHangRepository;

    public Cart convertRequestToEntity(GioHangRequest request) {
        return Cart.builder()
                .code(request.getCode())
                .createdAt(request.getCreatedAt())
                .customer(request.getCustomer())
                .status("Hoạt động")
                .build();
    }

    public Cart convertRequestToEntity(Cart Cart, GioHangRequest request) {
        Cart.setCode(request.getCode());
        Cart.setCreatedAt(request.getCreatedAt());
        Cart.setStatus("Hoạt động");
        return Cart;
    }

}
