package com.example.be.services.client.impl;

import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.BillHistory;
import com.example.be.repositories.client.BillDetailRepositoryClient;
import com.example.be.repositories.client.BillHistoryRepositoryClient;
import com.example.be.repositories.client.BillRepositoryClient;
import com.example.be.services.client.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TrackingServiceImpl implements TrackingService {
    @Autowired
    BillRepositoryClient hoaDonRepository;
    @Autowired
    BillDetailRepositoryClient hoaDonChiTietRepository;
    @Autowired
    BillHistoryRepositoryClient lichSuHoaDonRepository;
    @Override
    public Bill findByMaAndSDT(String ma , String sdt) {
        Bill hoaDon = hoaDonRepository.findByMaAndPhone(ma, sdt);
        return hoaDon;
    }

    @Override
    public BillRequestClient detailHoaDon(String ma) {
        Bill hoaDon = hoaDonRepository.findByCode(ma);

        List<BillDetail> hoaDonChiTietList = hoaDonChiTietRepository.findByBill(hoaDon);
        List<BillHistory> billHistories = lichSuHoaDonRepository.findAllByIdHD(hoaDon.getId());

        BillRequestClient hoaDonRequest = new BillRequestClient();
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
            hoaDonRequest.setNote(hoaDon.getNote());
            hoaDonRequest.setAddress(hoaDon.getAddress());
            hoaDonRequest.setCreatedAt(hoaDon.getCreatedAt());
            hoaDonRequest.setUpdatedAt(hoaDon.getUpdatedAt());
            hoaDonRequest.setBillHistory(billHistories);
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với mã: " + ma);
        }

        return hoaDonRequest;
    }
}
