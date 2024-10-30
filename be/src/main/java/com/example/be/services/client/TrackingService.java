package com.example.be.services.client;

import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.entities.Bill;
import org.springframework.stereotype.Service;

@Service
public interface TrackingService {
    Bill findByMaAndSDT(String ma , String sdt );
    BillRequestClient detailHoaDon(String  ma );
}
