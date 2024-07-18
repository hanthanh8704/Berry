package com.example.be.service.impl;

import com.example.be.dto.request.product.SanPhamRequest;
import com.example.be.dto.request.product.SanPhamSearchRequest;
import com.example.be.dto.response.SanPhamReponse;
import com.example.be.entity.SanPham;
import com.example.be.repository.SanPhamRepositoty;

import com.example.be.service.SanPhamService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.ProductConverter;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamImpl implements SanPhamService {

    private String genCode() {
        String prefix = "SP00";
        int x = 1;
        String code = prefix + x;
        while (sanPhamRepository.existsByMa(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }
    private final SanPhamRepositoty sanPhamRepository;
    private final ProductConverter productConverter;

    @Override
    public boolean existsByTenIgnoreCase(String ten) {
        return sanPhamRepository.existsByTenIgnoreCase(ten);
    }

    @Autowired
    public SanPhamImpl(SanPhamRepositoty sanPhamRepository, ProductConverter productConverter) {
        this.sanPhamRepository = sanPhamRepository;
        this.productConverter = productConverter;
    }

    @Override
    public PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        SanPhamSearchRequest customRequest = SanPhamSearchRequest.builder()
                .ten(request.getTen())
                .mauSac(request.getMauSac())
                .kichCo(request.getKichCo())
                .chatLieu(request.getChatLieu())
                .thuongHieu(request.getThuongHieu())
                .tayAo(request.getTayAo())
                .coAo(request.getCoAo())
                .danhMuc(request.getDanhMuc())
                .minPrice(request.getMinPrice())
                .maxPrice(request.getMaxPrice())
                .trangThai(request.getTrangThai())
                .build();

        return new PageableObject<>(sanPhamRepository.getAllSanPham(customRequest, pageable));
    }

    @Override
    public SanPham getOne(Integer id) {
        return sanPhamRepository.findByIdSp(id);
    }

    @Override
    public SanPham create(SanPhamRequest request) {
        if (sanPhamRepository.existsByTenIgnoreCase(request.getTen())) {
            throw new RestApiException(request.getTen() + " đã tồn tại!");
        }
        request.setMa(genCode());
        SanPham sanPham = productConverter.convertRequestToEntity(request);
        return sanPhamRepository.save(sanPham);

    }

    @Override
    public SanPham update(Integer id, SanPhamRequest request) {
        return null;
    }

    @Override
    public SanPham changeStatus(Integer id) {
        return null;
    }

    @Override
    public List<SanPhamReponse> getTopSell(Integer top) {
        return null;
    }
}
