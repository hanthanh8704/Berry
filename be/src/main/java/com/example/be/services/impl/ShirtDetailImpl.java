package com.example.be.services.impl;

import com.example.be.dto.admin.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.ShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.UpdateShirtDetailRequest;
import com.example.be.dto.admin.response.ShirtDetailResponse;
import com.example.be.repositories.admin.*;
import com.example.be.services.ShirtDetailService;
import com.example.be.utils.common.GenCodee;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;

import com.example.be.utils.constant.Status;
import com.example.be.utils.converter.ShirtDetailConverter;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.security.config.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.example.be.entities.*;

@Service
public class ShirtDetailImpl implements ShirtDetailService {
    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @Autowired
    private ShirtDetailConverter shirtDetailConverter;
    @Autowired
    private IImagesRepository anhRepository;
    @Autowired
    private ShirtRepository shirtRepository;
    @Autowired
    private ColorRepository colorRepository;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private CollarRepository collarRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private SleeveRepository sleeveRepository;
    @Autowired
    private MaterialRepository materialRepository;

    private String genCode() {
        String prefix = "SPCT00";
        int x = 1;
        String code = prefix + x;
        while (shirtDetailRepository.existsByDetailCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public PageableObject<ShirtDetailResponse> getAll(FindShirtDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindShirtDetailRequest customRequest = FindShirtDetailRequest.builder()
                .colors(request.getColor() != null ? Arrays.asList(request.getColor().split(",")) : null)
                .products(request.getProduct() != null ? Arrays.asList(request.getProduct().split(",")) : null)
                .sizes(request.getSize() != null ? Arrays.asList(request.getSize().split(",")) : null)
                .sleeves(request.getSleeve() != null ? Arrays.asList(request.getSleeve().split(",")) : null)
                .size(request.getSize())
                .color(request.getColor())
                .product(request.getProduct())
                .sleeve(request.getSleeve())
                .name(request.getName())
                .build();
        return new PageableObject<>(shirtDetailRepository.getAll(customRequest, pageable));
    }

    @Override
    public ProductDetail getOne(Integer id) {
        return shirtDetailRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public String create(List<ShirtDetailRequest> list) {
        // Validate empty list
        if (list == null || list.isEmpty()) {
            throw new RestApiException("Danh sách chi tiết sản phẩm không được trống!");
        }

        for (ShirtDetailRequest request : list) {
            // Validate required fields
            validateShirtDetailRequest(request);

            request.setCode(genCode());
            ProductDetail convert = shirtDetailConverter.convertRequestToEntity(request);

            // Set weight and default values
            convert.setWeight(request.getWeight());
            convert.setDiscountPrice(BigDecimal.ZERO);
            convert.setDiscountPercentage(0);
            convert.setQuantityError(0);


            // Check if ProductDetail already exists
            ProductDetail check = shirtDetailRepository.findByProduct_IdAndColor_IdAndSize_IdAndMaterial_IdAndCollar_IdAndSleeve_Id(
                    request.getProduct(),
                    request.getColor(),
                    request.getSize(),
                    request.getMaterial(),
                    request.getCollar(),
                    request.getSleeve()
            );

            if (check != null) {
                check.setQuantity(check.getQuantity() + request.getQuantity());
                shirtDetailRepository.save(check);
            } else {
                ProductDetail shirtDetailSave = shirtDetailRepository.save(convert);
                Product shirt = shirtDetailSave.getProduct();
                shirtRepository.save(shirt);

                if (request.getListImages() != null) {
                    if (request.getListImages().size() > 5) {
                        throw new RestApiException("Chỉ được thêm tối đa 5 hình ảnh!");
                    }
                    for (String imageUrl : request.getListImages()) {
                        if (imageUrl == null || imageUrl.trim().isEmpty()) {
                            throw new RestApiException("URL hình ảnh không được trống!");
                        }
                        anhRepository.save(Image.builder()
                                .productDetail(shirtDetailSave)
                                .url(imageUrl)
                                .status("Hoạt động")
                                .build());
                    }
                }
            }
        }
        return "Thêm thành công!";
    }

    private void validateShirtDetailRequest(ShirtDetailRequest request) {
        if (request.getProduct() == null) {
            throw new RestApiException("Sản phẩm không được trống!");
        }
        if (request.getColor() == null) {
            throw new RestApiException("Màu sắc không được trống!");
        }
        if (request.getSize() == null) {
            throw new RestApiException("Kích thước không được trống!");
        }
        if (request.getMaterial() == null) {
            throw new RestApiException("Chất liệu không được trống!");
        }
        if (request.getCollar() == null) {
            throw new RestApiException("Cổ áo không được trống!");
        }
        if (request.getSleeve() == null) {
            throw new RestApiException("Tay áo không được trống!");
        }
        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new RestApiException("Số lượng không hợp lệ!");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Giá không hợp lệ!");
        }
    }

    @Override
    @Transactional
    public ProductDetail update(Integer id, UpdateShirtDetailRequest request) {
        ProductDetail old = shirtDetailRepository.findById(id)
                .orElseThrow(() -> new RestApiException("ChiTietSanPham not found with id " + id));

        old.setPrice(request.getPrice());
        old.setQuantity(request.getQuantity());
        old.setSize(sizeRepository.findByName(request.getSize()));
        old.setSleeve(sleeveRepository.findByName(request.getSleeve()));
        old.setColor(colorRepository.findByName(request.getColor()));
        old.setMaterial(materialRepository.findByName(request.getMaterial()));
        old.setCollar(collarRepository.findByName(request.getCollar()));
        old.setBrand(brandRepository.findByName(request.getBrand()));
        old.setWeight(request.getWeight()); // Set weight
        old.setDiscountPrice(BigDecimal.ZERO);
        old.setDiscountPercentage(0);
        old.setStatus(Status.DANG_SU_DUNG);
        old.setDetailCode(GenCodee.genCodeByName(old.getDetailCode()));

        return shirtDetailRepository.save(old);
    }


    @Override
    public ProductDetail delete(Integer id) {
        return null;
    }

    @Override
    public ResponseObject updateFast(List<ShirtDetailRequest> list) {
        for (ShirtDetailRequest request : list) {
            ProductDetail convert = shirtDetailConverter.convertRequestToEntityFast(shirtDetailRepository.findById(request.getId()).get(), request);
            shirtDetailRepository.save(convert);
        }
        return new ResponseObject(list);
    }

    @Override
    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return shirtDetailRepository.findMinAndMaxPrice();
    }

    @Override
    public ShirtDetailResponse getOneShoeDetail(Integer id) {
        return shirtDetailRepository.getOneShoeDetail(id);
    }


}
