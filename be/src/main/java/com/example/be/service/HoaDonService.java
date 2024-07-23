package com.example.be.service;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.HoaDonResponse;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import com.example.be.repository.HoaDonRepository;
import com.example.be.util.common.PageableObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.List;

public interface HoaDonService {
    PageableObject<HoaDonResponse> getAll(HoaDonSearchRequest request);

    List<TKHoaDonTrangThai> getHoaDonByTrangThai();

    List<HoaDon> getNewHoaDon(HoaDonSearchRequest request);

    HoaDon findByMa(String ma);

    HoaDon getOne(Integer id);

    HoaDon create();

    HoaDon orderBill(Integer id,HoaDonRequest request);

    HoaDon changeStatus(Integer id, String ghiChu, String trangThai);

    HoaDon changeInfoCustomer(Long id, HoaDonRequest request);

    // Hàm này dùng để xuất file pdf của hóa đơn
}
