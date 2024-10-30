package com.example.be.services.impl;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.services.BillDetailService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.StatusBill;
import com.example.be.utils.converter.BillDetailConvert;
import com.example.be.utils.exception.RestApiException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hanthanh
 */
@Service
@Transactional
public class BillDetailServiceImpl implements BillDetailService {

    private final BillRepository hoaDonRepository;
    private final BillDetailRepository hoaDonChiTietRepository;
    private final ProductDetailPromotionRepository dotGiamGiaDetailRepository;
    private final ShirtDetailRepository chiTietSanPhamRepository;
    private final BillHistoryRepository lichSuHoaDonRepository;
    private final BillDetailConvert billDetailConvert;

    public BillDetailServiceImpl(BillRepository hoaDonRepository, BillDetailRepository hoaDonChiTietRepository, ProductDetailPromotionRepository dotGiamGiaDetailRepository, ShirtDetailRepository chiTietSanPhamRepository, BillHistoryRepository lichSuHoaDonRepository, BillDetailConvert billDetailConvert) {
        this.hoaDonRepository = hoaDonRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.dotGiamGiaDetailRepository = dotGiamGiaDetailRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.billDetailConvert = billDetailConvert;
    }

    //
//    @Override
//    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
//        return new PageableObject<>(hoaDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
//    }
    @Override
    public List<BillDetail> findByHoaDonId(Integer idBill) {
        return hoaDonChiTietRepository.findByHoaDonId(idBill);
    }

    @Override
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
    }

    @Override
    public BillDetail getOne(Integer id) {
        return hoaDonChiTietRepository.findById(id).orElse(null);
    }

    @Override
    public BillDetail create(BillDetailRequest request) {
        ProductDetailPromotion dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getDetailCode());
        System.out.println("Dot giam gia:" + dotGiamGiaDetail);
        System.out.println("Dòng 61 :" + request.getIdBill());
        System.out.println("Hihi :" + request);
        BillDetail hdct = billDetailConvert.convertRequestToEntity(request);
        System.out.println("Hoa don chi tiet:" + hdct);
        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
        System.out.println("Chi tiet san pham:" + ctsp);

        if (request.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > ctsp.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }

        ctsp.setQuantity(ctsp.getQuantity() - request.getQuantity());
        chiTietSanPhamRepository.save(ctsp);

        // Xử lý nghiệp vụ thêm sản phẩm vào giỏ hàng
        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonID(request.getDetailCode(), request.getIdBill());

        BillDetail exHDCT = null;
        for (BillDetail item : exHDCTList) {
            if (dotGiamGiaDetail != null && item.getPrice().compareTo(dotGiamGiaDetail.getNewPrice()) == 0) {
                exHDCT = item;
                break;
            }
            if (dotGiamGiaDetail == null && item.getPrice().compareTo(ctsp.getPrice()) == 0) {
                exHDCT = item;
                break;
            }
        }

        if (exHDCT != null) {
            // Sản phẩm đã có trong giỏ hàng và đang trong đợt giảm giá
            exHDCT.setQuantity(exHDCT.getQuantity() + request.getQuantity());
            return hoaDonChiTietRepository.save(exHDCT);
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng hoặc giá khác nhau, tạo một bản ghi mới
            if (dotGiamGiaDetail != null) {
                hdct.setPrice(dotGiamGiaDetail.getNewPrice());
            } else {
                hdct.setPrice(ctsp.getPrice());
            }
            hdct.setQuantity(request.getQuantity());
            BillDetail saveHDCT = hoaDonChiTietRepository.save(hdct);

            Bill hoaDon = saveHDCT.getBill();
            if (hoaDon.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
                // Xử lý tính tổng tiền
                BigDecimal caculateTotalMoney = BigDecimal.ZERO;
                for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hdct.getBill().getId())) {
                    BigDecimal donGia = x.getPrice() != null ? x.getPrice() : BigDecimal.ZERO;
                    BigDecimal soLuong = BigDecimal.valueOf(x.getQuantity());
                    caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
                }
                BigDecimal soTienDuocGiam = hoaDon.getDiscountAmount() != null ? hoaDon.getDiscountAmount() : BigDecimal.ZERO;
                BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
                hoaDon.setTotalMoney(tongTien);
                if (hoaDon.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hoaDon.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hoaDon.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
                    BillHistory lichSuHoaDon = new BillHistory();
                    lichSuHoaDon.setBill(hoaDon);
                    lichSuHoaDon.setActionDescription("Đã thêm " + request.getQuantity() + " sản phẩm \"" + ctsp.getProduct().getName() + " [" + dotGiamGiaDetail.getOldPrice() + " - " + dotGiamGiaDetail.getNewPrice() + "]\"");
                    lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
                    lichSuHoaDonRepository.save(lichSuHoaDon);
                }
                hoaDonRepository.save(hoaDon);
            }
            return saveHDCT;
        }
    }


    @Override
    public BillDetail update(Integer id, BillDetailRequest request) {
        BillDetail hdct = hoaDonChiTietRepository.findById(id).get();
        return hoaDonChiTietRepository.save(billDetailConvert.convertRequestToEntity(hdct, request));
    }

    @Override
    public BillDetail delete(Integer id) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        System.out.println("hdct : " + hoaDonChiTiet);
        ProductDetail chiTietSanPham = hoaDonChiTiet.getProductDetail();
        System.out.println("ctsp" + chiTietSanPham);
        chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + hoaDonChiTiet.getQuantity());
        hoaDonChiTietRepository.delete(hoaDonChiTiet);

        Bill hd = hoaDonChiTiet.getBill();
        if (hd.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
            // Xử lý tính tổng tiền
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            BigDecimal soTienDuocGiam = hd.getDiscountAmount() != null ? hd.getDiscountAmount() : BigDecimal.ZERO;
            hd.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(soTienDuocGiam));

            if (hd.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hd.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hd.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
                BillHistory lichSuHoaDon = new BillHistory();
                lichSuHoaDon.setBill(hd);
                lichSuHoaDon.setActionDescription("Đã xóa " + hoaDonChiTiet.getQuantity() + " sản phẩm \"" + chiTietSanPham.getProduct().getName() + " [" + hoaDonChiTiet.getPrice() + "]\"");
                lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }

            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }


    @Override
    public BillDetail updateSoLuong(Integer id, Integer newQuantity, BigDecimal donGia) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        ProductDetail chiTietSanPham = hoaDonChiTiet.getProductDetail();
        if (newQuantity > (chiTietSanPham.getQuantity() + hoaDonChiTiet.getQuantity())) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (newQuantity <= 0) {
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + hoaDonChiTiet.getQuantity() - newQuantity);
        hoaDonChiTiet.setQuantity(newQuantity);
        if (hoaDonChiTiet.getPrice().compareTo(donGia) < 0) {
            hoaDonChiTiet.setPrice(donGia);
        }
        hoaDonChiTietRepository.save(hoaDonChiTiet);
        chiTietSanPhamRepository.save(chiTietSanPham);
        Bill hd = hoaDonChiTiet.getBill();
        if (hd.getInvoiceStatus() == StatusBill.TAO_HOA_DON) {
            // Hàm xử lý update lại tiền
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            BigDecimal soTienDuocGiam = hd.getDiscountAmount() != null ? hd.getDiscountAmount() : BigDecimal.ZERO;
            hd.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(soTienDuocGiam));

            if (hd.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hd.getInvoiceStatus() == StatusBill.XAC_NHAN || hd.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
                BillHistory lichSuHoaDon = new BillHistory();
                lichSuHoaDon.setBill(hd);
                lichSuHoaDon.setActionDescription("Đã xóa " + hoaDonChiTiet.getQuantity() + " sản phẩm \"" + chiTietSanPham.getProduct().getName() + " [" + hoaDonChiTiet.getPrice() + "]\"");
                lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }
            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }
}
