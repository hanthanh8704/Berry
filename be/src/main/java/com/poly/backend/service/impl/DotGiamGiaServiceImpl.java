package com.poly.backend.service.impl;

import com.poly.backend.dto.request.DotGiamGiaRequest;
import com.poly.backend.dto.response.DotGiamGiaResponse;

import com.poly.backend.entity.English.ProductDetail;
import com.poly.backend.entity.English.ProductDetailPromotion;
import com.poly.backend.entity.English.Promotion;

import com.poly.backend.infrastructure.common.ResponseObject;
import com.poly.backend.infrastructure.converter.DotGiamGiaConvert;
import com.poly.backend.infrastructure.exception.RestApiException;
import com.poly.backend.repository.DotGiamGiaDetailRepository;
import com.poly.backend.repository.DotGiamGiaRepository;
import com.poly.backend.repository.SPCT_Repository;
import com.poly.backend.repository.SanPhamRepository;
import com.poly.backend.service.DotGiamGiaService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DotGiamGiaServiceImpl implements DotGiamGiaService {
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @Autowired
    private SPCT_Repository spct_repository;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private DotGiamGiaConvert dotGiamGiaConvert;

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
    public ResponseObject create(DotGiamGiaRequest request) {
        // Kiểm tra độ dài của mã đợt giảm giá
        // Kiểm tra độ dài của tên đợt giảm giá

        if (request.getName().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }

        // Kiểm tra giá trị giảm giá
        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 50) {
            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
        }

        // Kiểm tra ngày bắt đầu và ngày kết thúc
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }

        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }

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
    public ResponseObject update(Integer id, DotGiamGiaRequest request) {
        deleteAll(id);
        Promotion dotGiamGia = dotGiamGiaRepository.findById(id).get();

        // Kiểm tra độ dài của tên đợt giảm giá
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }

        // Kiểm tra giá trị giảm giá
        if (request.getDiscountPercentage() < 1 || request.getDiscountPercentage() > 50) {
            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
        }

        // Kiểm tra ngày bắt đầu và ngày kết thúc
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }

        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }

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

    @Override
    public DotGiamGiaResponse getOne(Integer id) {
        return dotGiamGiaRepository.findByIdDotGiamGia(id);

    }

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
            dotGiamGia.setDeleted(true); //true laf 1 true của deleted là xóa
            dotGiamGia.setStatus("Đã kết thúc");

            dotGiamGiaRepository.save(dotGiamGia); // Lưu lại đối tượng DotGiamGia sau khi cập nhật trường deleted

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
            if (dotGiamGia.getDeleted() == true) {
                LocalDateTime startDate = dotGiamGia.getStartDate();
                LocalDateTime endDate = dotGiamGia.getEndDate();
                if (currentDateTime.isBefore(startDate)) {

                    dotGiamGia.setStatus("Sắp diễn ra");
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    dotGiamGia.setStatus("Đang diễn ra");
                } else {
                    dotGiamGia.setStatus("Đã kết thúc");
                }
                if (endDate.isEqual(startDate)) {
                    dotGiamGia.setStatus("Đã kết thúc");
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
                    dotGiamGiaDetail.setStatus("Sắp diễn ra");
                    spct.setDiscountPrice(BigDecimal.valueOf(0));
                    dotGiamGiaDetail.setOldPrice(spct.getPrice());
                    dotGiamGiaDetail.setNewPrice(dotGiamGiaDetail.getOldPrice().multiply(BigDecimal.valueOf(1 - dotGiamGiaDetail.getPromotion().getDiscountPercentage() / 100.0)));
                    dotGiamGiaDetail.setDiscount(dotGiamGiaDetail.getOldPrice().subtract(dotGiamGiaDetail.getNewPrice()));
                    spct.setDiscountPercentage(0);

                } else if (dotGiamGiaDetail.getStartDate().isBefore(now) && dotGiamGiaDetail.getEndDate().isAfter(now)) {
                    dotGiamGiaDetail.setStatus("Đang diễn ra");

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
                    dotGiamGiaDetail.setStatus("Đã kết thúc");
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
        if (promotionToUpdate.getStatus().equals("Đã kết thúc")) {
            throw new RestApiException("Đợt giảm giá này đã kết thúc rồi!");
        }
        if (promotionToUpdate.getStatus().equals("Sắp diễn ra")) {
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            promotionToUpdate.setStartDate(startDate);
        }
        promotionToUpdate.setEndDate(currentDate);
        promotionToUpdate.setStatus("Đã kết thúc"); // Đã kết thúc
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
