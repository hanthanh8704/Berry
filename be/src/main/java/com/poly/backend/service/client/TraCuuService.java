package com.poly.backend.service.client;

import com.poly.backend.dto.request.hoadon.HoaDonRequest;
import com.poly.backend.entity.English.Bill;

import org.springframework.stereotype.Service;

@Service
public interface TraCuuService {
    Bill findByMaAndSDT(String ma , String sdt );
    HoaDonRequest detailHoaDon(String  ma );
}
