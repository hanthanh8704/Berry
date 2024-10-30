package com.example.be.dto.admin.response;

import com.example.be.entities.ProductDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {ProductDetail.class})
public interface ShirtDetailResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    Integer getProduct(); // SanPham

    String getDetailCode(); // Ma

    String getName(); // Ten

    String getColor(); // MauSac

    String getSize(); // KichCo

    String getSleeve(); // TayAo

    String getCollar(); // CoAo

    String getBrand(); // ThuongHieu

    String getMaterial(); // ChatLieu

    Integer getQuantity(); // SoLuong

    BigDecimal getPrice(); // GiaBan

    String getImages(); // Images

    String getStatus(); // TrangThai

    // Của bán hàng

    BigDecimal getDiscountPrice();
    BigDecimal getOldPrice();
    BigDecimal getNewPrice();
}
