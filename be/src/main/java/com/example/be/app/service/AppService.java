package com.example.be.app.service;

import com.example.be.app.dto.request.AppBillRequest;
import com.example.be.app.dto.response.GetProductDetailBillResponse;
import com.example.be.entities.BillDetail;

import java.util.List;

public interface AppService {
    List<GetProductDetailBillResponse> getProductDetailBillSell(Integer id);

    Boolean increaseQuantityBillDetail(Integer idBillDetail, Integer idPrDetail);

    Boolean decreaseQuantityBillDetail(Integer idBillDetail, Integer idPrDetail);

    Boolean inputQuantityBillDetail(Integer idBillDetail, Integer idProDetail, Integer quantity);
    BillDetail addBillDetail(AppBillRequest request, Integer id);
    Boolean rollBackQuantityProductDetail(Integer idBill, Integer idPrDetail);
}
