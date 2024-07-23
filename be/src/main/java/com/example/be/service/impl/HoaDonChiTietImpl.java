package com.example.be.service.impl;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.*;
import com.example.be.repository.*;
import com.example.be.service.HoaDonChiTietService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.constant.BillStatusConstant;
import com.example.be.util.converter.BillDetailConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HoaDonChiTietImpl implements HoaDonChiTietService {
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    private final ChiTietSanPhamRepository chiTietSanPhamRepository;
    private final LichSuHoaDonRepository lichSuHoaDonRepository;
    private final BillDetailConvert billDetailConvert;

    @Autowired
    public HoaDonChiTietImpl(HoaDonRepository hoaDonRepository, HoaDonChiTietRepository hoaDonChiTietRepository, DotGiamGiaDetailRepository dotGiamGiaDetailRepository, ChiTietSanPhamRepository chiTietSanPhamRepository, LichSuHoaDonRepository lichSuHoaDonRepository, BillDetailConvert billDetailConvert) {
        this.hoaDonRepository = hoaDonRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.dotGiamGiaDetailRepository = dotGiamGiaDetailRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.billDetailConvert = billDetailConvert;
    }

    @Override
    public PageableObject<HoaDonChiTietResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
    }

    @Override
    public HoaDonChiTiet getOne(Integer id) {
        return hoaDonChiTietRepository.findById(id).orElse(null);
    }

    @Override
    public List<HoaDonChiTiet> findByHoaDonId(Integer idHoaDon) {
        return hoaDonChiTietRepository.findByHoaDonId(idHoaDon);
    }


    @Override
    public HoaDonChiTiet create(BillDetailRequest request) {
        System.out.println("Request " + request.getChiTietSanPham());
        DotGiamGiaDetail dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getChiTietSanPham());
        System.out.println("Dot giam gia:" + dotGiamGiaDetail);
        System.out.println("Dòng 61 :" + request.getHoaDon());
        System.out.println("Hihi :" + request);
        HoaDonChiTiet hdct = billDetailConvert.convertRequestToEntity(request);
        System.out.println("Hoa don chi tiet:" + hdct);
        ChiTietSanPham ctsp = chiTietSanPhamRepository.findByMa(request.getChiTietSanPham());
        System.out.println("Chi tiet san pham:" + ctsp);
        if (request.getSoLuong() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getSoLuong() > ctsp.getSoLuong()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        ctsp.setSoLuong(ctsp.getSoLuong() - request.getSoLuong());
        chiTietSanPhamRepository.save(ctsp);

        // Xử lý nghiệp vụ thêm sản phẩm vào giỏ hàng
        HoaDonChiTiet exHDCT = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonID(request.getChiTietSanPham(), request.getHoaDon());
        if (exHDCT != null) {
            exHDCT.setDonGia(dotGiamGiaDetail != null ? dotGiamGiaDetail.getGiaMoi() : ctsp.getGiaBan());
            exHDCT.setSoLuong(exHDCT.getSoLuong() + request.getSoLuong());
            // Kiểm tra và cập nhật giá nếu giá yêu cầu cao hơn giá hiện tại
            if (request.getGia() != null) {
                BigDecimal currentDonGia = exHDCT.getDonGia();
                if (currentDonGia == null) {
                    currentDonGia = BigDecimal.ZERO; // Hoặc giá mặc định nếu cần
                }
                if (currentDonGia.compareTo(request.getGia()) < 0) {
                    exHDCT.setDonGia(request.getGia());
                }
            }

            return hoaDonChiTietRepository.save(exHDCT);
        }
        HoaDonChiTiet saveHDCT = hoaDonChiTietRepository.save(hdct);

        HoaDon hoaDon = saveHDCT.getHoaDon();
        if (hoaDon.getTrangThaiHoaDon() != BillStatusConstant.TAO_DON_HANG) {
            // Xử lý tính tổng tiền
            BigDecimal caculateTotalMoney = BigDecimal.ZERO;
            for (HoaDonChiTiet x : hoaDonChiTietRepository.findByHoaDonId(hdct.getHoaDon().getId())) {
                // Tính tiền cho từng chi tiết hóa đơn và cộng dồn vào tổng tiền
                BigDecimal donGia = x.getDonGia() != null ? x.getDonGia() : BigDecimal.ZERO;
                BigDecimal soLuong = BigDecimal.valueOf(x.getSoLuong());
                caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
            }
            BigDecimal soTienDuocGiam = hoaDon.getSoTienDuocGiam() != null ? hoaDon.getSoTienDuocGiam() : BigDecimal.ZERO;
            BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
            hoaDon.setTongTien(tongTien);
            if (hoaDon.getTrangThaiHoaDon() == BillStatusConstant.CHO_GIAO_HANG || hoaDon.getTrangThaiHoaDon() == BillStatusConstant.CHO_XAC_NHAN || hoaDon.getTrangThaiHoaDon() == BillStatusConstant.CHO_THANH_TOAN) {
                LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
                lichSuHoaDon.setHoaDon(hoaDon);
                lichSuHoaDon.setGhiChu("Đã thêm " + request.getSoLuong() + " sản phẩm \"" + ctsp.getSanPham().getTen() + " [" + dotGiamGiaDetail.getGiaCu() + " - " + dotGiamGiaDetail.getGiaMoi() + "]\"");
                lichSuHoaDon.setTrangThai(BillStatusConstant.CHINH_SUA_DON_HANG);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }
            hoaDonRepository.save(hoaDon);
        }
        return saveHDCT;
    }

    @Override
    public HoaDonChiTiet update(Integer id, BillDetailRequest request) {
        HoaDonChiTiet hdct = hoaDonChiTietRepository.findById(id).get();
        return hoaDonChiTietRepository.save(billDetailConvert.convertRequestToEntity(hdct, request));
    }

    @Override
    public HoaDonChiTiet delete(Integer id) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        ChiTietSanPham chiTietSanPham = hoaDonChiTiet.getChiTietSanPham();
        chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + hoaDonChiTiet.getSoLuong());
        hoaDonChiTietRepository.delete(hoaDonChiTiet);

        HoaDon hd = hoaDonChiTiet.getHoaDon();
        if (hd.getTrangThaiHoaDon() != BillStatusConstant.TAO_DON_HANG) {
            // Xử lý tính tổng tiền
            Double caculateTotalMoney = 0.0;
            for (HoaDonChiTiet x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getSoLuong() * x.getDonGia().doubleValue();
            }
            hd.setTongTien(BigDecimal.valueOf(caculateTotalMoney).subtract(hd.getSoTienDuocGiam()));

            if (hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_GIAO_HANG || hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_XAC_NHAN || hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_THANH_TOAN) {
                LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
                lichSuHoaDon.setHoaDon(hd);
                lichSuHoaDon.setGhiChu("Đã xóa " + hoaDonChiTiet.getSoLuong() + " sản phẩm \"" + chiTietSanPham.getSanPham().getTen() + " [" + hoaDonChiTiet.getDonGia() + "]\"");
                lichSuHoaDon.setTrangThai(BillStatusConstant.CHINH_SUA_DON_HANG);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }
            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }

    @Override
    public HoaDonChiTiet updateSoLuong(Integer id, Integer newQuantity, BigDecimal donGia) {
        HoaDonChiTiet hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        ChiTietSanPham chiTietSanPham = hoaDonChiTiet.getChiTietSanPham();
        if (newQuantity > (chiTietSanPham.getSoLuong() + hoaDonChiTiet.getSoLuong())) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (newQuantity <= 0) {
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + hoaDonChiTiet.getSoLuong() - newQuantity);
        hoaDonChiTiet.setSoLuong(newQuantity);
        if (hoaDonChiTiet.getDonGia().compareTo(donGia) < 0) {
            hoaDonChiTiet.setDonGia(donGia);
        }
        hoaDonChiTietRepository.save(hoaDonChiTiet);
        chiTietSanPhamRepository.save(chiTietSanPham);
        HoaDon hd = hoaDonChiTiet.getHoaDon();
        if (hd.getTrangThaiHoaDon() != BillStatusConstant.TAO_DON_HANG) {
            // Hàm xử lý update lại tiền
            Double caculateTotalMoney = 0.0;
            for (HoaDonChiTiet x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getSoLuong() * x.getDonGia().doubleValue();
            }
            hd.setTongTien(BigDecimal.valueOf(caculateTotalMoney).subtract(hd.getSoTienDuocGiam()));

            if (hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_GIAO_HANG || hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_XAC_NHAN || hd.getTrangThaiHoaDon() == BillStatusConstant.CHO_THANH_TOAN) {
                LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
                lichSuHoaDon.setHoaDon(hd);
                lichSuHoaDon.setGhiChu("Đã xóa " + hoaDonChiTiet.getSoLuong() + " sản phẩm \"" + chiTietSanPham.getSanPham().getTen() + " [" + hoaDonChiTiet.getDonGia() + "]\"");
                lichSuHoaDon.setTrangThai(BillStatusConstant.CHINH_SUA_DON_HANG);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }
            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }
}
