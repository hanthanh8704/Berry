package com.example.be.service.impl;


import com.example.be.dto.request.material.ChatLieuRequest;
import com.example.be.dto.response.ChatLieuResponse;
import com.example.be.entity.ChatLieu;
import com.example.be.repository.ChatLieuRepository;
import com.example.be.service.ChatLieuService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.MaterialConverter;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ChatLieuImpl implements ChatLieuService {
    private final ChatLieuRepository chatLieuRepository;

    @Autowired
    private MaterialConverter materialConverter;

    @Autowired
    public ChatLieuImpl(ChatLieuRepository chatLieuRepository) {
        this.chatLieuRepository = chatLieuRepository;
    }

    @Override
    public PageableObject<ChatLieuResponse> getAll(ChatLieuRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(chatLieuRepository.findAllByCriteria(request, pageable));
    }

    @Override
    public ChatLieu getOne(Integer id) {
        return chatLieuRepository.findById(id).orElse(null);
    }

    @Override
    public ChatLieu create(ChatLieuRequest request) {
        if (chatLieuRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException("Màu " + request.getTen() + " đã tồn tại!");
        }
        ChatLieu chatLieu = materialConverter.convertRequestToEntity(request);
        return chatLieuRepository.save(chatLieu);
    }

    @Override
    public ChatLieu update(Integer id, ChatLieuRequest request) {
        ChatLieu oldColor = chatLieuRepository.findById(id).get();
        if (chatLieuRepository.existsByTenIgnoreCase(request.getTen())) {
            if (oldColor.getTen().equals(request.getTen())) {
                return chatLieuRepository.save(materialConverter.convertRequestToEntity(oldColor, request));
            }
            throw new RestApiException("Màu " + request.getTen() + " đã tồn tại!");
        } else {
            return chatLieuRepository.save(materialConverter.convertRequestToEntity(oldColor, request));
        }
    }
}
