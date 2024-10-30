package com.example.be.utils.converter;


import com.example.be.dto.admin.request.material.MaterialRequest;
import com.example.be.entities.Material;
import org.springframework.stereotype.Component;

@Component
public class MaterialConverter {
    public Material convertRequestToEntity(MaterialRequest request) {
        Material chatLieu = Material.builder()

                .name(request.getName())
                .status(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động")
                .build();
        return chatLieu;
    }

    public Material convertRequestToEntity(Material entity, MaterialRequest request) {

        entity.setName(request.getName());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : "Đang Hoạt động");
        return entity;
    }
}
