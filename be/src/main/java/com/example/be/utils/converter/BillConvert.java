package com.example.be.utils.converter;


import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.entities.Bill;
import com.example.be.repositories.admin.BillRepository;
import com.example.be.repositories.admin.CustomerRepository;
import com.example.be.repositories.admin.VoucherRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BillConvert {
    private final BillRepository hoaDonRepository;
    private final VoucherRepository phieuGiamGiaRepository;
    private final CustomerRepository khachHangRepository;

    public BillConvert(BillRepository hoaDonRepository, VoucherRepository phieuGiamGiaRepository, CustomerRepository khachHangRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.phieuGiamGiaRepository = phieuGiamGiaRepository;
        this.khachHangRepository = khachHangRepository;
    }


    public String genBillCode() {
        String prefix = "HD100";
        int x = 1;
        String code = prefix + x;
        while (hoaDonRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        System.out.println(code);
        return code;
    }

    public Bill convertRequestToEntity(Bill entity, BillRequest request) {
        if(request.getVoucherId() != null){
            entity.setVoucher(phieuGiamGiaRepository.findById(request.getVoucherId()).get());
            System.out.println(request.getVoucherId());
        }
        if(request.getCustomerId() != null){
            entity.setCustomer(khachHangRepository.findById(request.getCustomerId()).get());
        }
        entity.setRecipientName(request.getRecipientName());
        entity.setRecipientPhone(request.getRecipientPhone());
        entity.setAddress(request.getAddress());
        entity.setShippingFee(request.getShippingFee());
        entity.setDiscountAmount(request.getDiscountAmount());
        entity.setTotalMoney(request.getTotalMoney().subtract(
                request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO
        ));

        entity.setNote(request.getNote());
        entity.setInvoiceStatus(request.getInvoiceStatus());
        entity.setInvoiceType(request.getInvoiceType());
        return entity;
    }
}
