package com.example.be.dto.admin.response.bill;

import java.math.BigDecimal;

public interface BillGiveBack {

    Integer getSTT();


    String getIdBillDetail();


    String getImage();


    String getIdProductDetail();


    String getNameProduct();


    Integer getQuantity();

    BigDecimal getPrice();


    String getCodeColor();


    Integer getStatusBillDetail();

    BigDecimal getMoneyShip();

    Integer getPromotion();

}

