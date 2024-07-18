package com.example.be.util.converter;

import com.example.be.dto.request.size.KichCoRequest;
import com.example.be.entity.KichCo;
import org.springframework.stereotype.Component;

@Component
public class SizeConverter {
    public KichCo convertRequestToEntity(KichCoRequest request) {
        KichCo kichCo = KichCo.builder()
                .ten(request.getTen())
                .trangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động")
                .build();
        return kichCo;
    }

    public KichCo convertRequestToEntity(KichCo entity, KichCoRequest request) {
        entity.setTen(request.getTen());
        entity.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "Hoạt động");
        return entity;
    }
}
