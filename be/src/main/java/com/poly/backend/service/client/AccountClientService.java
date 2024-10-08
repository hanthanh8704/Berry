package com.poly.backend.service.client;

import com.poly.backend.dto.request.khachhang.KhachHangRequest;
import org.springframework.stereotype.Service;

@Service
public interface AccountClientService {
    KhachHangRequest updateKH(Integer idKH , KhachHangRequest request);

}
