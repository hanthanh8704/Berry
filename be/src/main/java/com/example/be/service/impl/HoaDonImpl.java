package com.example.be.service.impl;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.HoaDonResponse;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import com.example.be.entity.LichSuHoaDon;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.entity.ThanhToan;
import com.example.be.repository.*;
import com.example.be.service.HoaDonService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.constant.BillStatusConstant;
import com.example.be.util.constant.ThanhToanEnum;
import com.example.be.util.constant.TypeBill;
import com.example.be.util.constant.TyperOrderConstant;
import com.example.be.util.converter.BillConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class HoaDonImpl implements HoaDonService {
    private final HoaDonRepository hoaDonRepository;
    private final BillConvert billConvert;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final LichSuHoaDonRepository lichSuHoaDonRepository;
    private final NhanVienRepository nhanVienRepository;
    private final ThanhToanRespository thanhToanRespository;

    private final PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    public HoaDonImpl(HoaDonRepository hoaDonRepository, BillConvert billConvert, HoaDonChiTietRepository hoaDonChiTietRepository, LichSuHoaDonRepository lichSuHoaDonRepository, NhanVienRepository nhanVienRepository, ThanhToanRespository thanhToanRespository, PhieuGiamGiaRepository phieuGiamGiaRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.billConvert = billConvert;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.thanhToanRespository = thanhToanRespository;
        this.phieuGiamGiaRepository = phieuGiamGiaRepository;
    }

    // Gen mã
    private String genBillCode() {
        String prefix = "HD00";
        int x = 1;
        String ma = prefix + x;
        while (hoaDonRepository.existsByMa(ma)) {
            x++;
            ma = prefix + x;
        }
        return ma;
    }

    @Override
    public PageableObject<HoaDonResponse> getAll(HoaDonSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonRepository.getAllHoaDon(request, pageable));
    }

    @Override
    public List<TKHoaDonTrangThai> getHoaDonByTrangThai() {
        return hoaDonRepository.getHoaDonByTrangThai();
    }

    @Override
    public List<HoaDon> getNewHoaDon(HoaDonSearchRequest request) {
        return hoaDonRepository.getNewBill(request);
    }

    @Override
    public HoaDon findByMa(String ma) {
        return hoaDonRepository.findByMa(ma);
    }

    @Override
    public HoaDon getOne(Integer id) {
        return hoaDonRepository.findById(id).orElse(null);
    }

    // Hàm này dùng để tạo 1 hóa đơn bán hàng tại quầy
    @Override
    public HoaDon create() {
        HoaDon hd = new HoaDon();
        LichSuHoaDon lshd = new LichSuHoaDon();
        hd.setNhanVien(nhanVienRepository.findById(1).orElse(null));
        hd.setTrangThaiHoaDon(BillStatusConstant.TAO_DON_HANG);
        hd.setMa(genBillCode());
//        hd.setLoaiHoaDon(TypeBill.TAI_QUAY);
        HoaDon saveHD = hoaDonRepository.save(hd);
        lshd.setHoaDon(saveHD);
        lshd.setNhanVien(saveHD.getNhanVien());
        lshd.setGhiChu("Tạo đơn hàng");
        lichSuHoaDonRepository.save(lshd);
        return null;
    }

    @Override
    public HoaDon orderBill(Integer id, HoaDonRequest request) {
        if (request.getPhieuGiamGia() != null) {
            PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(request.getPhieuGiamGia()).get();
            phieuGiamGia.setSoLuong(phieuGiamGia.getSoLuong() - 1);
            phieuGiamGiaRepository.save(phieuGiamGia);
        }

        LichSuHoaDon lichSuHoaDon = new LichSuHoaDon();
        ThanhToan thanhToan = new ThanhToan();
        HoaDon hoaDon = billConvert.convertRequestToEntity(hoaDonRepository.findById(id).get(), request);
        lichSuHoaDon.setHoaDon(hoaDon);
        thanhToan.setHoaDon(hoaDon);
        thanhToan.setTenHinhThuc(ThanhToanEnum.TIEN_KHACH_DUA);

        if (request.getChoThanhToan()) {
            hoaDon.setTrangThaiHoaDon(BillStatusConstant.CHO_THANH_TOAN);
            lichSuHoaDon.setTrangThai(BillStatusConstant.CHO_THANH_TOAN);
            lichSuHoaDonRepository.save(lichSuHoaDon);
            hoaDonRepository.save(hoaDon);
            return hoaDon;
        }

        if ("Tại quầy".equals(request.getLoaiHoaDon())) {
            hoaDon.setTrangThaiHoaDon(BillStatusConstant.HOAN_THANH);
            hoaDon.setNgayNhanHang(new Timestamp(System.currentTimeMillis()));
            LichSuHoaDon lshd = new LichSuHoaDon();
            lshd.setHoaDon(hoaDon);
            lshd.setGhiChu(BillStatusConstant.DA_XAC_NHAN);
            lshd.setTrangThai(BillStatusConstant.DA_XAC_NHAN);
            lichSuHoaDonRepository.save(lshd);
        }

        if (ThanhToanEnum.TIEN_MAT.equals(request.getHinhThucThanhToan())) {
            thanhToan.setTongTienThanhToan(hoaDon.getTongTien());
            thanhToan.setGhiChu("Thanh toán tiền mặt");
            thanhToan.setTenHinhThuc(ThanhToanEnum.TIEN_MAT);
            thanhToanRespository.save(thanhToan);
        } else if (ThanhToanEnum.CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
            thanhToan.setTongTienThanhToan(hoaDon.getTongTien());
            thanhToan.setGhiChu("Thanh toán chuyển khoản");
            thanhToan.setTenHinhThuc(ThanhToanEnum.CHUYEN_KHOAN);
            thanhToanRespository.save(thanhToan);
        } else if (ThanhToanEnum.TIEN_MAT_VA_CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
            ThanhToan tt = new ThanhToan();
            tt.setHoaDon(hoaDon);
            tt.setTongTienThanhToan(request.getTienMat());
            tt.setGhiChu("Thanh toán tiền mặt");
            tt.setTenHinhThuc(ThanhToanEnum.TIEN_MAT);
            thanhToanRespository.save(tt);
            tt.setTongTienThanhToan(request.getTienChuyenKhoan());
            tt.setMa_giao_dich(request.getMaGiaoDich());
            tt.setGhiChu("Thanh toán chuyển khoản");
            tt.setTenHinhThuc(ThanhToanEnum.CHUYEN_KHOAN);
            thanhToanRespository.save(tt);
        }

        lichSuHoaDon.setGhiChu("Mua hàng thành công");
        lichSuHoaDon.setTrangThai(BillStatusConstant.HOAN_THANH);


        if ("Giao hàng".equals(request.getLoaiHoaDon())) {
            hoaDon.setTrangThaiHoaDon(BillStatusConstant.CHO_GIAO_HANG);
            lichSuHoaDon.setTrangThai(BillStatusConstant.CHO_GIAO_HANG);
            lichSuHoaDon.setGhiChu(BillStatusConstant.CHO_GIAO_HANG);

            if (ThanhToanEnum.CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
                LichSuHoaDon lshd = new LichSuHoaDon();
                lshd.setHoaDon(hoaDon);
                lshd.setGhiChu("Đã xác nhận thông tin thanh toán!");
                lshd.setTrangThai(BillStatusConstant.DA_XAC_NHAN);
                lichSuHoaDonRepository.save(lshd);
                thanhToan.setTrangThai("Đã chuyển khoản!");
                thanhToan.setGhiChu("Đã chuyển khoản!");
                thanhToan.setMa_giao_dich(request.getMaGiaoDich());
                thanhToan.setTenHinhThuc(ThanhToanEnum.CHUYEN_KHOAN);
                thanhToanRespository.save(thanhToan);
            } else if (ThanhToanEnum.TIEN_MAT_VA_CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
                thanhToan.setTongTienThanhToan(request.getTienChuyenKhoan());
                thanhToan.setGhiChu("Đã chuyển khoản!");
                thanhToan.setMa_giao_dich(request.getMaGiaoDich());
                thanhToan.setTenHinhThuc(ThanhToanEnum.CHUYEN_KHOAN);
                thanhToanRespository.save(thanhToan);
            }
        }

        lichSuHoaDonRepository.save(lichSuHoaDon);
        hoaDonRepository.save(hoaDon);
        return hoaDon;
    }

    @Override
    public HoaDon changeStatus(Integer id, String ghiChu, String trangThai) {
        return null;
    }

    @Override
    public HoaDon changeInfoCustomer(Long id, HoaDonRequest request) {
        return null;
    }

}
