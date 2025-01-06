package com.example.be.services.impl;//package com.example.be.services.impl;

import com.example.be.dto.admin.request.promotion.PromotionRequest;
import com.example.be.entities.ProductDetail;
import com.example.be.entities.ProductDetailPromotion;
import com.example.be.entities.Promotion;
import com.example.be.repositories.admin.ProductDetailPromotionRepository;
import com.example.be.repositories.admin.ProductDetailRepository;
import com.example.be.repositories.admin.ProductRepository;
import com.example.be.repositories.admin.PromotionRepository;
import com.example.be.services.PromotionService;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.constant.StatusPromotion;
import com.example.be.utils.converter.PromotionConvert;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private PromotionRepository dotGiamGiaRepository;
    @Autowired
    private ProductDetailPromotionRepository dotGiamGiaDetailRepository;
    @Autowired
    private ProductDetailRepository spct_repository;
    @Autowired
    private ProductRepository sanPhamRepository;
    @Autowired
    private PromotionConvert dotGiamGiaConvert;

    private String genCode() {
        String prefix = "DGG00";
        int x = 1;
        String ma = prefix + x;
        while (dotGiamGiaRepository.existsByCode(ma)) {
            x++;
            ma = prefix + x;
        }
        return ma;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(PromotionRequest request) {
        // Kiểm tra độ dài của mã đợt giảm giá
        // Kiểm tra độ dài của tên đợt giảm giá

//        if (request.getName().length() > 50) {
//            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
//        }
//
//        // Kiểm tra giá trị giảm giá
//        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 50) {
//            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
//        }
//
//        // Kiểm tra ngày bắt đầu và ngày kết thúc
//        if (request.getStartDate().isAfter(request.getEndDate())) {
//            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
//        }
//
//        if (request.getStartDate().isEqual(request.getEndDate())) {
//            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
//        }
//
//        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
//            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
//        }

        if (request.getCode().isEmpty()) {
            request.setCode(genCode());
        } else {
            request.setCode(request.getCode());
        }
        // Lưu đợt giảm giá vào cơ sở dữ liệu
        Promotion dotGiamGiaSave = dotGiamGiaRepository.save(dotGiamGiaConvert.convertRequestToEntity(request));

        // Cập nhật trạng thái khuyến mãi
        updateStatusPromotion();

        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {
            ProductDetail sanPhamDetail = spct_repository.findById(x).get();

            BigDecimal oldPrice = sanPhamDetail.getPrice();
            BigDecimal newPrice = oldPrice.multiply(BigDecimal.valueOf(1 - request.getDiscountPercentage() / 100.0));

            ProductDetailPromotion dotGiamGiaDetail = new ProductDetailPromotion();
            dotGiamGiaDetail.setPromotion(dotGiamGiaSave);
            dotGiamGiaDetail.setProductDetail(sanPhamDetail);

            // Tìm và cập nhật giá cũ cho các đợt giảm giá đã có cùng idSPCT
            List<ProductDetailPromotion> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findByIdSPCT(x);
            if (!dotGiamGiaDetailList.isEmpty()) {
                for (ProductDetailPromotion existingDetail : dotGiamGiaDetailList) {
                    existingDetail.setOldPrice(oldPrice);
                    dotGiamGiaDetailRepository.save(existingDetail);
                }
            }
            dotGiamGiaDetail.setNewPrice(newPrice);
            dotGiamGiaDetail.setOldPrice(oldPrice);
            dotGiamGiaDetail.setDiscount(oldPrice.subtract(newPrice));
            dotGiamGiaDetail.setStatus(dotGiamGiaSave.getStatus());
            dotGiamGiaDetail.setStartDate(dotGiamGiaSave.getStartDate());
            dotGiamGiaDetail.setEndDate(dotGiamGiaSave.getEndDate());
            dotGiamGiaDetailRepository.save(dotGiamGiaDetail);
        }

        // Cập nhật trạng thái chi tiết đợt giảm giá
        updateStatusDotGiamGiaDetail();
        return new ResponseObject(request);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject update(Integer id, PromotionRequest request) {
        deleteAll(id);
        Promotion dotGiamGia = dotGiamGiaRepository.findById(id).get();

        // Kiểm tra độ dài của tên đợt giảm giá
//        if (request.getName().length() > 50) {
//            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
//        }
//
//        // Kiểm tra giá trị giảm giá
//        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 50) {
//            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
//        }
//
//        // Kiểm tra ngày bắt đầu và ngày kết thúc
//        if (request.getStartDate().isAfter(request.getEndDate())) {
//            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
//        }
//
//        if (request.getStartDate().isEqual(request.getEndDate())) {
//            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
//        }
//
//        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
//            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
//        }

        // Lưu đợt giảm giá vào cơ sở dữ liệu
        Promotion dotGiamGiaSave = dotGiamGiaRepository.save(dotGiamGiaConvert.convertRequestToEntity(dotGiamGia, request));

        // Cập nhật trạng thái khuyến mãi
        updateStatusPromotion();


        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {

            ProductDetail sanPhamDetail = spct_repository.findById(x).get();
            BigDecimal giaCu = sanPhamDetail.getPrice();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - request.getDiscountPercentage() / 100.0));

            ProductDetailPromotion dotGiamGiaDetail = new ProductDetailPromotion();
            dotGiamGiaDetail.setPromotion(dotGiamGiaSave);
            dotGiamGiaDetail.setProductDetail(sanPhamDetail);

            // Tìm và cập nhật giá cũ cho các đợt giảm giá đã có cùng idSPCT
            List<ProductDetailPromotion> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findByIdSPCT(x);
            if (!dotGiamGiaDetailList.isEmpty()) {
                for (ProductDetailPromotion existingDetail : dotGiamGiaDetailList) {
                    existingDetail.setOldPrice(giaCu);
                    dotGiamGiaDetailRepository.save(existingDetail);
                }
            }

            dotGiamGiaDetail.setNewPrice(giaMoi);
            dotGiamGiaDetail.setOldPrice(giaCu);
            dotGiamGiaDetail.setDiscount(giaCu.subtract(giaMoi));
            dotGiamGiaDetail.setStatus(dotGiamGiaSave.getStatus());
            dotGiamGiaDetail.setStartDate(dotGiamGiaSave.getStartDate());
            dotGiamGiaDetail.setEndDate(dotGiamGiaSave.getEndDate());
            dotGiamGiaDetailRepository.save(dotGiamGiaDetail);
        }

        // Cập nhật trạng thái chi tiết đợt giảm giá
        updateStatusDotGiamGiaDetail();

        return new ResponseObject(dotGiamGia);
    }

//    @Override
//    public DotGiamGiaResponse getOne(Integer id) {
//        return dotGiamGiaRepository.findByIdDotGiamGia(id);
//
//    }

    @Override
    public List<Integer> getListIdShoePromotion(Integer idPromotion) {
        dotGiamGiaDetailRepository.getListIdSanPhamDotGiamGia(idPromotion);
        return dotGiamGiaDetailRepository.getListIdSanPhamDotGiamGia(idPromotion);
    }

    @Override
    public List<Integer> getListIdShoeDetailInPromotion(Integer idPromotion) {
        return dotGiamGiaDetailRepository.getListIdSanPhamDetailInDotGiamGia(idPromotion);
    }

    @Override
    public void deleteAll(Integer idPromotion) {
        dotGiamGiaDetailRepository.deleteAllById(dotGiamGiaDetailRepository.findIdsByDotGiamGiaId(idPromotion));
    }

    @Override
    public void deletedDotGiamGia(Integer idDGG) {
        Optional<Promotion> dotGiamGiaOpt = dotGiamGiaRepository.findById(idDGG);
        if (dotGiamGiaOpt.isPresent()) {
            Promotion dotGiamGia = dotGiamGiaOpt.get();
            dotGiamGia.setDeleted(true);
            dotGiamGia.setStatus(StatusPromotion.DA_KET_THUC);

            dotGiamGiaRepository.save(dotGiamGia);

            List<ProductDetailPromotion> dotGiamGiaDetails = dotGiamGiaDetailRepository.getDGGDetailByidDotGG(idDGG);
            for (ProductDetailPromotion dotGiamGiaDetail : dotGiamGiaDetails) {
                Integer idSPCT = dotGiamGiaDetail.getProductDetail().getId();
                Optional<ProductDetail> spctOpt = spct_repository.findById(idSPCT);
                if (spctOpt.isPresent()) {
                    ProductDetail spct = spctOpt.get();
                    spct.setDiscountPercentage(0);
                    spct.setPrice(dotGiamGiaDetail.getOldPrice());
                    spct_repository.save(spct); // Lưu lại đối tượng SPCT sau khi cập nhật giá bán
                }
            }
            dotGiamGiaDetailRepository.deleteAll(dotGiamGiaDetails);
        } else {
            // Xử lý trường hợp không tìm thấy DotGiamGia với idDGG
            throw new EntityNotFoundException("DotGiamGia not found with id " + idDGG);
        }
    }


    @Override
    public void updateStatusPromotion() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<Promotion> promotions = dotGiamGiaRepository.findAll();
        for (Promotion dotGiamGia : promotions) {
            if (dotGiamGia.getDeleted() == false) {
                LocalDateTime startDate = dotGiamGia.getStartDate();
                LocalDateTime endDate = dotGiamGia.getEndDate();
                if (currentDateTime.isBefore(startDate)) {
                    dotGiamGia.setStatus(StatusPromotion.SAP_DIEN_RA);
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    dotGiamGia.setStatus(StatusPromotion.DANG_DIEN_RA);
                } else {
                    dotGiamGia.setStatus(StatusPromotion.DA_KET_THUC);
                }
                if (endDate.isEqual(startDate)) {
                    dotGiamGia.setStatus(StatusPromotion.DA_KET_THUC);
                }
                dotGiamGiaRepository.save(dotGiamGia);
            }
        }
    }

    @Override
    public void updateStatusDotGiamGiaDetail() {
        LocalDateTime now = LocalDateTime.now(); // Lấy thời gian hiện tại
        List<ProductDetailPromotion> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findAll(); // Lấy tất cả các chi tiết đợt giảm giá từ repository

        if (dotGiamGiaDetailList.isEmpty()) {
            return; // Không có chi tiết đợt giảm giá để cập nhật
        }

        for (ProductDetailPromotion dotGiamGiaDetail : dotGiamGiaDetailList) {
            Integer idSPCT = dotGiamGiaDetail.getProductDetail().getId(); // Lấy ID sản phẩm cụ thể
            Optional<ProductDetail> spctOptional = spct_repository.findById(idSPCT); // Tìm sản phẩm cụ thể (SPCT) bằng ID

            if (spctOptional.isPresent()) {
                ProductDetail spct = spctOptional.get();
                List<ProductDetailPromotion> dotGiamGiaDDG = dotGiamGiaDetailList.stream()
                        .filter(detail -> detail.getProductDetail().getId().equals(idSPCT) && detail.getStartDate().isBefore(now) && detail.getEndDate().isAfter(now))
                        .collect(Collectors.toList());

                if (dotGiamGiaDetail.getStartDate().isAfter(now)) {
                    dotGiamGiaDetail.setStatus(StatusPromotion.SAP_DIEN_RA);
                    spct.setDiscountPrice(BigDecimal.valueOf(0));
                    dotGiamGiaDetail.setOldPrice(spct.getPrice());
                    dotGiamGiaDetail.setNewPrice(dotGiamGiaDetail.getOldPrice().multiply(BigDecimal.valueOf(1 - dotGiamGiaDetail.getPromotion().getDiscountPercentage() / 100.0)));
                    dotGiamGiaDetail.setDiscount(dotGiamGiaDetail.getOldPrice().subtract(dotGiamGiaDetail.getNewPrice()));
                    spct.setDiscountPercentage(0);
                } else if (dotGiamGiaDetail.getStartDate().isBefore(now) && dotGiamGiaDetail.getEndDate().isAfter(now)) {
                    dotGiamGiaDetail.setStatus(StatusPromotion.DANG_DIEN_RA);

                    BigDecimal giaMoi;
                    if (dotGiamGiaDDG.size() > 1) {
                        int totalDiscount = dotGiamGiaDDG.stream().mapToInt(detail -> detail.getPromotion().getDiscountPercentage()).sum();
                        int averageDiscount = totalDiscount / dotGiamGiaDDG.size();
                        spct.setDiscountPercentage(averageDiscount);
                        giaMoi = spct.getPrice().multiply(BigDecimal.valueOf(1 - averageDiscount / 100.0));
                    } else {
                        spct.setDiscountPercentage(dotGiamGiaDetail.getPromotion().getDiscountPercentage());
                        giaMoi = spct.getPrice().multiply(BigDecimal.valueOf(1 - spct.getDiscountPercentage() / 100.0));
                    }

                    dotGiamGiaDetail.setOldPrice(spct.getPrice());
                    dotGiamGiaDetail.setNewPrice(giaMoi);
                    dotGiamGiaDetail.setDiscount(dotGiamGiaDetail.getOldPrice().subtract(dotGiamGiaDetail.getNewPrice()));
                    spct.setDiscountPrice(giaMoi);
                } else if (dotGiamGiaDetail.getEndDate().isBefore(now)) {
                    dotGiamGiaDetail.setStatus(StatusPromotion.DA_KET_THUC);
                    spct.setPrice(spct.getPrice());
                    spct.setDiscountPrice(BigDecimal.valueOf(0));
                    dotGiamGiaDetail.setOldPrice(spct.getPrice());
                    dotGiamGiaDetail.setNewPrice(dotGiamGiaDetail.getOldPrice().multiply(BigDecimal.valueOf(1 - dotGiamGiaDetail.getPromotion().getDiscountPercentage() / 100.0)));
                    dotGiamGiaDetail.setDiscount(dotGiamGiaDetail.getOldPrice().subtract(dotGiamGiaDetail.getNewPrice()));
                    spct.setDiscountPercentage(0);
                }

                spct_repository.save(spct);
            }
        }

        dotGiamGiaDetailRepository.saveAll(dotGiamGiaDetailList);
    }



    @Override
    public Promotion updateEndDate(Integer id) {
        Promotion promotionToUpdate = dotGiamGiaRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if (promotionToUpdate.getStatus() == StatusPromotion.DA_KET_THUC) {
            throw new RestApiException("Đợt giảm giá này đã kết thúc rồi!");
        }
        if (promotionToUpdate.getStatus() == StatusPromotion.SAP_DIEN_RA) {
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            promotionToUpdate.setStartDate(startDate);
        }
        promotionToUpdate.setEndDate(currentDate);
        promotionToUpdate.setStatus(StatusPromotion.DA_KET_THUC); // Đã kết thúc
        return dotGiamGiaRepository.save(promotionToUpdate);
    }

    @Override
    public List<ProductDetail> SPCT(Integer idDGG) {
        return dotGiamGiaRepository.findByAllSPCTByIdDotGiamGia(idDGG);
    }

    public boolean isCodeUnique(String code) {
        Optional<Promotion> existingPromotion = dotGiamGiaRepository.findByMa(code);
        return existingPromotion.isEmpty();
    }
}
