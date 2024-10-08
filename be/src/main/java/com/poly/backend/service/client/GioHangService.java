package com.poly.backend.service.client;

import com.poly.backend.dto.client.request.GioHangChiTietRequest;
import com.poly.backend.dto.client.request.GioHangRequest;
import com.poly.backend.dto.request.diachi.DiaChiRequest;
import com.poly.backend.dto.request.hoadon.HoaDonRequest;
import com.poly.backend.dto.request.khachhang.KhachHangRequest;
import com.poly.backend.dto.request.sanpham.SanPhamRequest;

import com.poly.backend.entity.English.Address;
import com.poly.backend.entity.English.Voucher;

import com.poly.backend.infrastructure.common.ResponseObject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GioHangService {
    List<GioHangChiTietRequest> getAll(Integer idKH);

    ResponseObject create(GioHangRequest request);

    GioHangRequest muaHang(GioHangRequest request);

    ResponseObject thanhToan(HoaDonRequest request);

    ResponseObject delete(Integer id);

    KhachHangRequest detail(Integer idKH);

    Address selectedDiaChi(Integer idDC);

    ResponseObject deleteAll();

    ResponseObject update(Integer id, GioHangRequest request);

    ResponseObject createDiaChi(DiaChiRequest request);

    Address updateDiaChiMD(Integer idDC);

    ResponseObject updateSoLuong(Integer id, GioHangRequest request);

    List<SanPhamRequest> search(String key);
    List<SanPhamRequest> findFilteredSearchProducts(String key, Integer idMS , Integer idTH ,Integer idKC ,String priceRange ,String sort);

    List<Voucher> getAllByPublic();

    Voucher selectedPhieuGiamGia(Integer idDC);
    List<Voucher> getAllByCaNhan(Integer idKH);
    Voucher detailVoucher(Integer idP);
    List<HoaDonRequest> getAllDonMua(Integer idKH);
}
