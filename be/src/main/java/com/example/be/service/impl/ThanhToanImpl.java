package com.example.be.service.impl;

import com.example.be.dto.request.ThanhToanRequest;
import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.entity.HoaDon;
import com.example.be.entity.LichSuHoaDon;
import com.example.be.entity.ThanhToan;
import com.example.be.repository.LichSuHoaDonRepository;
import com.example.be.repository.ThanhToanRespository;
import com.example.be.service.ThanhToanService;
import com.example.be.util.common.ResponseObject;
import com.example.be.util.constant.BillStatusConstant;
import com.example.be.util.converter.ThanhToanConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
public class ThanhToanImpl implements ThanhToanService {
    private final ThanhToanRespository thanhToanRepository;
    private final ThanhToanConvert thanhToanConvert;
    private final LichSuHoaDonRepository billHistoryRepository;

    @Autowired
    public ThanhToanImpl(ThanhToanRespository thanhToanRepository, ThanhToanConvert thanhToanConvert, LichSuHoaDonRepository billHistoryRepository) {
        this.thanhToanRepository = thanhToanRepository;
        this.thanhToanConvert = thanhToanConvert;
        this.billHistoryRepository = billHistoryRepository;
    }

    @Override
    public List<ThanhToanResponse> getThanhToanByIdHoaDon(Integer idHoaDon) {
        return thanhToanRepository.getThanhToanByIdHoaDon(idHoaDon);
    }

    @Override
    public ResponseObject create(ThanhToanRequest request) {
        ThanhToan paymentMethod = thanhToanRepository.save(thanhToanConvert.convertRequestToEntity(request));
        List<ThanhToan> paymentMethods = thanhToanRepository.findByHoaDonIdAndTenHinhThuc(request.getHoaDon(), request.getTenPhuongThuoc());
        HoaDon bill = paymentMethod.getHoaDon();
        Double totalPayment = 0.0;
        for (ThanhToan x: paymentMethods) {
            totalPayment+=x.getTongTienThanhToan().doubleValue();
        }
        if (BigDecimal.valueOf(totalPayment).compareTo(bill.getTongTien().add(bill.getPhiShip())) >= 0) {
            LichSuHoaDon history1 = new LichSuHoaDon();
            history1.setHoaDon(bill);
            history1.setTrangThai(BillStatusConstant.DA_XAC_NHAN);
            history1.setGhiChu("Đã thanh toán đủ tiền");
            billHistoryRepository.save(history1);
        }
//        if(request.getType() == PaymentMethodConstant.TIEN_HOAN && bill.getStatus() == BillStatusConstant.TRA_HANG){
//            bill.setMoneyReduce(BigDecimal.ZERO);
//            billRepository.save(bill);
//        }
        return new ResponseObject(paymentMethod);
    }

    @Override
    public List<ThanhToan> findByHoaDonIdAndTenHinhThuc(Integer idHoaDon, String tenHinhThuc) {
        return thanhToanRepository.findByHoaDonIdAndTenHinhThuc(idHoaDon, tenHinhThuc);
    }
}
