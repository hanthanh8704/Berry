package com.example.be.services;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.request.billdetail.CreateBillDetailRequest;
import com.example.be.dto.admin.request.billdetail.RefundProductRequest;

import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.BillDetail;
import com.example.be.utils.common.PageableObject;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hanthanh
 */
public interface BillDetailService {
    PageableObject<BillDetailResponse> getAll(BillDetailRequest request);

    BillDetail getOne(Integer id);

    List<BillDetail> findByHoaDonId(Integer idBill);

    BillDetail create(BillDetailRequest request);
    BillDetail create1(BillDetailRequest request);
    BillDetail update(Integer id,BillDetailRequest request);
    BillDetail delete(Integer id);

    BillDetail updateSoLuong(Integer id, Integer newQuantity, BigDecimal donGia);


    BillDetail createBillDetail(BillDetailRequest request , Integer idNhanVien);
    BillDetail deleteBillDetail(Integer idHDCT, Integer idNhanVien);
    BillDetail updateSoLuongBillDetail(Integer id, Integer newQuantity , Integer idNhanVien);

}
