package com.example.be.dto.admin.response.billdetail;


import com.example.be.entities.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

/**
 * @author hanthanh
 */
@Projection(types = {Bill.class, BillDetail.class, ProductDetail.class, Product.class, Size.class})
public interface BillDetailResponse {

    @Value("#{target.indexs}")
    Integer getIndex();

    String getStt();

    Integer getIdProduct();


    Integer getIdBill();


    Integer getId();

    String getImage();

    String getDetailCode();

    String getProductName();


    String getNameColor();

    String getNameSize();


    String getNameSole();


    String getNameMaterial();


    String getNameCategory();

    BigDecimal getPrice();


    Integer getQuantity();


    Integer getMaxQuantity();


    Integer getPromotion();


    String getStatus();


    String getCodeColor();

    // Bán hàng mơới 21/10
    BigDecimal getDiscountPrice();

    BigDecimal getOldPrice();

    BigDecimal getNewPrice();
}
