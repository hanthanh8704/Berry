package com.example.be.services.impl;

import com.example.be.dto.admin.request.color.ColorRequest;
import com.example.be.dto.admin.response.ColorResponse;
import com.example.be.entities.Color;
import com.example.be.repositories.admin.ColorRepository;
import com.example.be.services.ColorService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.ColorConverter;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.hexcode.HexCodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ColorImpl implements ColorService {
    private final ColorRepository colorRepository;

    @Autowired
    public ColorImpl(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    @Autowired
    private ColorConverter colorConverter;

    @Override
    public PageableObject<ColorResponse> getAll(ColorRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(colorRepository.findAllByCriteria(request, pageable));
    }


    @Override
    public Color getOne(Integer id) {
        return colorRepository.findById(id).orElse(null);
    }

    @Override
    public Color create(ColorRequest request) {
        if (colorRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException("Màu " + request.getName() + " đã tồn tại!");
        }

        // Tạo hexCode từ tên màu
        String generatedHexCode = HexCodeUtil.generateHexCodeFromName(request.getName());
        request.setHexCode(generatedHexCode);

        Color color = colorConverter.convertRequestToEntity(request);
        return colorRepository.save(color);
    }

    @Override
    public Color update(Integer id, ColorRequest request) {
        Color oldColor = colorRepository.findById(id).orElseThrow(() -> new RestApiException("Màu không tồn tại!"));

        // Tạo hexCode mới từ tên màu nếu có sự thay đổi
        if (!oldColor.getName().equals(request.getName())) {
            String generatedHexCode = HexCodeUtil.generateHexCodeFromName(request.getName());
            request.setHexCode(generatedHexCode); // Set hexCode mới cho request
        }

        if (colorRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldColor.getName().equals(request.getName())) {
                return colorRepository.save(colorConverter.convertRequestToEntity(oldColor, request));
            }
            throw new RestApiException("Màu " + request.getName() + " đã tồn tại!");
        } else {
            return colorRepository.save(colorConverter.convertRequestToEntity(oldColor, request));
        }
    }



}
