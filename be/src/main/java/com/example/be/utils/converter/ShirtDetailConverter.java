package com.example.be.utils.converter;
import com.example.be.dto.admin.request.productDetail.ShirtDetailRequest;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.utils.common.GenCodee;
import com.example.be.utils.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ShirtDetailConverter {

    @Autowired
    private ShirtRepository shirtRepository;
    @Autowired
    private ColorRepository colorRepository;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private CollarRepository collarRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private SleeveRepository sleeveRepository;

    public ProductDetail convertRequestToEntity(ShirtDetailRequest request) {
        Product shirt = shirtRepository.findById(request.getProduct()).get();
        Color color = colorRepository.findById(request.getColor()).get();
        Size size = sizeRepository.findById(request.getSize()).get();
        Collar collar = collarRepository.findById(request.getCollar()).get();
        Material material = materialRepository.findById(request.getMaterial()).get();
        Brand brand = brandRepository.findById(request.getBrand()).get();
        Sleeve sleeve = sleeveRepository.findById(request.getSleeve()).get();

        return ProductDetail.builder()
                .product(shirt)
                .color(color)
                .size(size)
                .sleeve(sleeve)
                .collar(collar)
                .material(material)
                .brand(brand)
                .detailCode(GenCodee.genCodeByName(request.getCode()))
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .weight(request.getWeight())  // Thêm weight từ request
                .discountPrice(BigDecimal.ZERO)  // Đặt mặc định là 0
                .discountPercentage(0)           // Đặt mặc định là 0
                .status(Status.DANG_SU_DUNG)
                .createdBy("admin")
                .updatedBy("admin")
                .deleted(false)
                .build();
    }

    public ProductDetail convertRequestToEntity(ProductDetail entity, ShirtDetailRequest request) {
        Product shirt = shirtRepository.findById(request.getProduct()).get();
        Color color = colorRepository.findById(request.getColor()).get();
        Size size = sizeRepository.findById(request.getSize()).get();
        Collar collar = collarRepository.findById(request.getCollar()).get();
        Material material = materialRepository.findById(request.getMaterial()).get();
        Brand brand = brandRepository.findById(request.getBrand()).get();
        Sleeve sleeve = sleeveRepository.findById(request.getSleeve()).get();

        entity.setProduct(shirt);
        entity.setColor(color);
        entity.setSize(size);
        entity.setMaterial(material);
        entity.setCollar(collar);
        entity.setSleeve(sleeve);
        entity.setBrand(brand);
        entity.setDetailCode(GenCodee.genCodeByName(entity.getDetailCode()));
        entity.setPrice(request.getPrice());
        entity.setQuantity(request.getQuantity());
        entity.setWeight(request.getWeight());  // Thêm weight từ request
        entity.setStatus(Status.DANG_SU_DUNG);

        if (entity.getDiscountPrice() == null) {
            entity.setDiscountPrice(BigDecimal.ZERO);
        }
        if (entity.getDiscountPercentage() == null) {
            entity.setDiscountPercentage(0);
        }
        entity.setDeleted(false);
        entity.setCreatedBy("admin");
        entity.setUpdatedBy("admin");

        return entity;
    }

    public ProductDetail convertRequestToEntityFast(ProductDetail entity, ShirtDetailRequest request) {
        entity.setPrice(request.getPrice());
        entity.setQuantity(request.getQuantity());
        entity.setWeight(request.getWeight());  // Thêm weight từ request

        if (entity.getDiscountPrice() == null) {
            entity.setDiscountPrice(BigDecimal.ZERO);
        }
        if (entity.getDiscountPercentage() == null) {
            entity.setDiscountPercentage(0);
        }

        return entity;
    }
}
