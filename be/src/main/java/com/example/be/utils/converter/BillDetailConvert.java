package com.example.be.utils.converter;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.ProductDetail;
import com.example.be.entities.ProductDetailPromotion;
import com.example.be.repositories.admin.BillRepository;
import com.example.be.repositories.admin.ProductDetailPromotionRepository;
import com.example.be.repositories.admin.ShirtDetailRepository;
import com.example.be.utils.constant.StatusBill;
import org.springframework.stereotype.Component;

@Component
public class BillDetailConvert {
    private final ProductDetailPromotionRepository dotGiamGiaDetailRepository;
    private final ShirtDetailRepository chiTietSanPhamRepository;
    private final BillRepository hoaDonRepository;

    public BillDetailConvert(ProductDetailPromotionRepository dotGiamGiaDetailRepository, ShirtDetailRepository chiTietSanPhamRepository, BillRepository hoaDonRepository) {
        this.dotGiamGiaDetailRepository = dotGiamGiaDetailRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.hoaDonRepository = hoaDonRepository;
    }


    public BillDetail convertRequestToEntity(BillDetailRequest request) {
        ProductDetail ctsp = chiTietSanPhamRepository.findByMaSPCT(request.getDetailCode());
        Bill hd = hoaDonRepository.findById(request.getIdBill()).get();
        ProductDetailPromotion dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getDetailCode());
        return BillDetail.builder()
                .bill(hd)
                .productDetail(ctsp)
                .price(dotGiamGiaDetail != null? dotGiamGiaDetail.getNewPrice() : ctsp.getPrice())
                .quantity(request.getQuantity())
                .status(request.getStatus())
                .build();
    }

    public BillDetail convertRequestToEntity(BillDetail entity, BillDetailRequest request) {
        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
        Bill hd = hoaDonRepository.findById(request.getIdBill()).get();
        ProductDetailPromotion dotGiamGiaDetail = dotGiamGiaDetailRepository.findByIdSPCT_Ma(request.getDetailCode());
        entity.setProductDetail(ctsp);
        entity.setBill(hd);
        entity.setPrice(dotGiamGiaDetail != null ? dotGiamGiaDetail.getNewPrice() : ctsp.getPrice());
        entity.setQuantity(request.getQuantity());
        return entity;
    }
}
