package com.poly.backend.service.client.impl;

import com.poly.backend.dto.request.hoadon.HoaDonRequest;
import com.poly.backend.entity.English.Bill;
import com.poly.backend.entity.English.Bill_detail;

import com.poly.backend.repository.HoaDonChiTietRepository;
import com.poly.backend.repository.HoaDonRepository;
import com.poly.backend.service.client.TraCuuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TraCuuServiceImpl implements TraCuuService {
    @Autowired
    HoaDonRepository hoaDonRepository;
    @Autowired
    HoaDonChiTietRepository hoaDonChiTietRepository;

    @Override
    public Bill findByMaAndSDT(String ma , String sdt) {
        Bill hoaDon = hoaDonRepository.findByMaAndPhone(ma, sdt);
        return hoaDon;
    }

    @Override
    public HoaDonRequest detailHoaDon(String ma) {
        Bill hoaDon = hoaDonRepository.findByCode(ma);
        List<Bill_detail> hoaDonChiTietList = hoaDonChiTietRepository.findByBill(hoaDon);

        HoaDonRequest hoaDonRequest = new HoaDonRequest();

        if (hoaDon != null) {
            hoaDonRequest.setId(hoaDon.getId());
            hoaDonRequest.setEmployee(hoaDon.getEmployee());
            hoaDonRequest.setVoucher(hoaDon.getVoucher());
            hoaDonRequest.setCustomerId(hoaDon.getCustomer().getId());
            hoaDonRequest.setBillDetails(hoaDonChiTietList);
            hoaDonRequest.setCode(hoaDon.getCode());
            hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
            hoaDonRequest.setRecipientName(hoaDon.getRecipientName());
            hoaDonRequest.setDiscountAmount(hoaDon.getDiscountAmount());
            hoaDonRequest.setTotalMoney(hoaDon.getTotalMoney());
            hoaDonRequest.setShippingFee(hoaDon.getShippingFee());
            hoaDonRequest.setRecipientEmail(hoaDon.getRecipientEmail());
            hoaDonRequest.setRecipientPhone(hoaDon.getRecipientPhone());
            hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
            hoaDonRequest.setDeliveryStatus(hoaDon.getDeliveryStatus());
            hoaDonRequest.setDeliveryDate(hoaDon.getDeliveryDate());
            hoaDonRequest.setReceivedDate(hoaDon.getReceivedDate());
//            hoaDonRequest.setTransactionNo(hoaDon.getCreated_by()); //Ma hoa don
            hoaDonRequest.setNote(hoaDon.getNote());
            hoaDonRequest.setAddress(hoaDon.getAddress());
            hoaDonRequest.setCreatedAt(hoaDon.getCreatedAt());
            hoaDonRequest.setUpdatedAt(hoaDon.getUpdatedAt());
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với mã: " + ma);
        }

        return hoaDonRequest;
    }

}
