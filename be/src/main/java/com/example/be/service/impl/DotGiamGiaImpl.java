package com.example.be.service.impl;

import com.example.be.dto.request.dotgiamgia.DotGiamGiaRequest;
import com.example.be.dto.response.DotGiamGiaResponse;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.DotGiamGia;
import com.example.be.entity.DotGiamGiaDetail;
import com.example.be.repository.ChiTietSanPhamRepository;
import com.example.be.repository.DotGiamGiaDetailRepository;
import com.example.be.repository.DotGiamGiaRepository;
import com.example.be.repository.SanPhamRepositoty;
import com.example.be.service.DotGiamGiaService;
import com.example.be.util.common.ResponseObject;
import com.example.be.util.converter.DotGiamGiaConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DotGiamGiaImpl implements DotGiamGiaService {
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    private SanPhamRepositoty sanPhamRepository;
    @Autowired
    private DotGiamGiaConvert dotGiamGiaConvert;

    private String genCode() {
        String prefix = "DGG00";
        int x = 1;
        String ma = prefix + x;
        while (dotGiamGiaRepository.existsByMa(ma)) {
            x++;
            ma = prefix + x;
        }
        return ma;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(DotGiamGiaRequest request) {

        // Kiểm tra độ dài của tên đợt giảm giá
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }

        // Kiểm tra giá trị giảm giá
        if (request.getGiaTriGiam() < 1 || request.getGiaTriGiam() > 50) {
            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
        }

        // Kiểm tra ngày bắt đầu và ngày kết thúc
        if (request.getNgayBatDau().isAfter(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }

        if (request.getNgayBatDau().isEqual(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }

        if (request.getNgayBatDau().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }

        if (request.getMa().isEmpty()) {
            request.setMa(genCode());
        } else {
            request.setMa(request.getMa());
        }
        // Lưu đợt giảm giá vào cơ sở dữ liệu
        DotGiamGia dotGiamGiaSave = dotGiamGiaRepository.save(dotGiamGiaConvert.convertRequestToEntity(request));

        // Cập nhật trạng thái khuyến mãi
        updateStatusPromotion();


        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {
            ChiTietSanPham sanPhamDetail = chiTietSanPhamRepository.findById(x).get();

            BigDecimal giaCu = sanPhamDetail.getGiaBan();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - request.getGiaTriGiam() / 100.0));

            DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
            dotGiamGiaDetail.setIdDotGiamGia(dotGiamGiaSave);
            dotGiamGiaDetail.setIdSPCT(sanPhamDetail);

            // Tìm và cập nhật giá cũ cho các đợt giảm giá đã có cùng idSPCT
            List<DotGiamGiaDetail> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findByIdSPCT(x);
            if (!dotGiamGiaDetailList.isEmpty()) {
                for (DotGiamGiaDetail existingDetail : dotGiamGiaDetailList) {
                    existingDetail.setGiaCu(giaCu);
                    dotGiamGiaDetailRepository.save(existingDetail);
                }
            }


            dotGiamGiaDetail.setGiaMoi(giaMoi);
            dotGiamGiaDetail.setGiaCu(giaCu);
            dotGiamGiaDetail.setGiaGiam(giaCu.subtract(giaMoi));
            dotGiamGiaDetail.setTrangThai(dotGiamGiaSave.getTrangThai());
            dotGiamGiaDetail.setNgayBatDau(dotGiamGiaSave.getNgayBatDau());
            dotGiamGiaDetail.setNgayKetThuc(dotGiamGiaSave.getNgayKetThuc());
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

        DotGiamGia dotGiamGia = dotGiamGiaRepository.findById(id).get();


        // Kiểm tra độ dài của tên đợt giảm giá
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }

        // Kiểm tra giá trị giảm giá
        if (request.getGiaTriGiam() < 1 || request.getGiaTriGiam() > 50) {
            throw new RestApiException("Vui lòng nhập giá trị (%) không được dưới 1% và lớn hơn 50%!");
        }

        // Kiểm tra ngày bắt đầu và ngày kết thúc
        if (request.getNgayBatDau().isAfter(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }

        if (request.getNgayBatDau().isEqual(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }

        if (request.getNgayBatDau().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }

        // Lưu đợt giảm giá vào cơ sở dữ liệu
        DotGiamGia dotGiamGiaSave = dotGiamGiaRepository.save(dotGiamGiaConvert.convertRequestToEntity(dotGiamGia, request));

        // Cập nhật trạng thái khuyến mãi
        updateStatusPromotion();


        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {

            ChiTietSanPham sanPhamDetail = chiTietSanPhamRepository.findById(x).get();
            BigDecimal giaCu = sanPhamDetail.getGiaBan();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - request.getGiaTriGiam() / 100.0));

            DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
            dotGiamGiaDetail.setIdDotGiamGia(dotGiamGiaSave);
            dotGiamGiaDetail.setIdSPCT(sanPhamDetail);

            // Tìm và cập nhật giá cũ cho các đợt giảm giá đã có cùng idSPCT
            List<DotGiamGiaDetail> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findByIdSPCT(x);
            if (!dotGiamGiaDetailList.isEmpty()) {
                for (DotGiamGiaDetail existingDetail : dotGiamGiaDetailList) {
                    existingDetail.setGiaCu(giaCu);
                    dotGiamGiaDetailRepository.save(existingDetail);
                }
            }

            dotGiamGiaDetail.setGiaMoi(giaMoi);
            dotGiamGiaDetail.setGiaCu(giaCu);
            dotGiamGiaDetail.setGiaGiam(giaCu.subtract(giaMoi));
            dotGiamGiaDetail.setTrangThai(dotGiamGiaSave.getTrangThai());
            dotGiamGiaDetail.setNgayBatDau(dotGiamGiaSave.getNgayBatDau());
            dotGiamGiaDetail.setNgayKetThuc(dotGiamGiaSave.getNgayKetThuc());
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
        Optional<DotGiamGia> dotGiamGiaOpt = dotGiamGiaRepository.findById(idDGG);
        if (dotGiamGiaOpt.isPresent()) {
            DotGiamGia dotGiamGia = dotGiamGiaOpt.get();
            dotGiamGia.setDeleted(false);
            dotGiamGia.setTrangThai("Đã kết thúc");

            dotGiamGiaRepository.save(dotGiamGia); // Lưu lại đối tượng DotGiamGia sau khi cập nhật trường deleted

            List<DotGiamGiaDetail> dotGiamGiaDetails = dotGiamGiaDetailRepository.getDGGDetailByidDotGG(idDGG);
            for (DotGiamGiaDetail dotGiamGiaDetail : dotGiamGiaDetails) {
                Integer idSPCT = dotGiamGiaDetail.getIdSPCT().getId();
                Optional<ChiTietSanPham> spctOpt = chiTietSanPhamRepository.findById(idSPCT);
                if (spctOpt.isPresent()) {
                    ChiTietSanPham spct = spctOpt.get();
                    spct.setPhanTramGiam(0);
                    spct.setGiaBan(dotGiamGiaDetail.getGiaCu());
                    chiTietSanPhamRepository.save(spct); // Lưu lại đối tượng SPCT sau khi cập nhật giá bán
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
        List<DotGiamGia> promotions = dotGiamGiaRepository.findAll();
        for (DotGiamGia dotGiamGia : promotions) {
            if (dotGiamGia.getDeleted() == true) {
                LocalDateTime startDate = dotGiamGia.getNgayBatDau();
                LocalDateTime endDate = dotGiamGia.getNgayKetThuc();
                if (currentDateTime.isBefore(startDate)) {
                    dotGiamGia.setTrangThai("Sắp diễn ra");
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    dotGiamGia.setTrangThai("Đang diễn ra");
                } else {
                    dotGiamGia.setTrangThai("Đã kết thúc");
                }
                if (endDate.isEqual(startDate)) {
                    dotGiamGia.setTrangThai("Đã kết thúc");
                }
                dotGiamGiaRepository.save(dotGiamGia);
            }
        }
    }

    @Override
    public void updateStatusDotGiamGiaDetail() {
        LocalDateTime now = LocalDateTime.now(); // Lấy thời gian hiện tại
        List<DotGiamGiaDetail> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findAll(); // Lấy tất cả các chi tiết đợt giảm giá từ repository

        if (dotGiamGiaDetailList.isEmpty()) {
            return; // Không có chi tiết đợt giảm giá để cập nhật
        }

        for (DotGiamGiaDetail dotGiamGiaDetail : dotGiamGiaDetailList) {
            Integer idSPCT = dotGiamGiaDetail.getIdSPCT().getId(); // Lấy ID sản phẩm cụ thể
            Optional<ChiTietSanPham> spctOptional = chiTietSanPhamRepository.findById(idSPCT); // Tìm sản phẩm cụ thể (SPCT) bằng ID

            if (spctOptional.isPresent()) {
                ChiTietSanPham spct = spctOptional.get();
                List<DotGiamGiaDetail> dotGiamGiaDDG = dotGiamGiaDetailList.stream()
                        .filter(detail -> detail.getIdSPCT().getId().equals(idSPCT) && detail.getNgayBatDau().isBefore(now) && detail.getNgayKetThuc().isAfter(now))
                        .collect(Collectors.toList());

                if (dotGiamGiaDetail.getNgayBatDau().isAfter(now)) {
                    dotGiamGiaDetail.setTrangThai("Sắp diễn ra");
                    spct.setGiaMoi(BigDecimal.valueOf(0));
                    dotGiamGiaDetail.setGiaCu(spct.getGiaBan());
                    dotGiamGiaDetail.setGiaMoi(dotGiamGiaDetail.getGiaCu().multiply(BigDecimal.valueOf(1 - dotGiamGiaDetail.getIdDotGiamGia().getGiaTriGiam() / 100.0)));
                    dotGiamGiaDetail.setGiaGiam(dotGiamGiaDetail.getGiaCu().subtract(dotGiamGiaDetail.getGiaMoi()));
                    spct.setPhanTramGiam(0);
                } else if (dotGiamGiaDetail.getNgayBatDau().isBefore(now) && dotGiamGiaDetail.getNgayKetThuc().isAfter(now)) {
                    dotGiamGiaDetail.setTrangThai("Đang diễn ra");

                    BigDecimal giaMoi;
                    if (dotGiamGiaDDG.size() > 1) {
                        int totalDiscount = dotGiamGiaDDG.stream().mapToInt(detail -> detail.getIdDotGiamGia().getGiaTriGiam()).sum();
                        int averageDiscount = totalDiscount / dotGiamGiaDDG.size();
                        spct.setPhanTramGiam(averageDiscount);
                        giaMoi = spct.getGiaBan().multiply(BigDecimal.valueOf(1 - averageDiscount / 100.0));
                    } else {
                        spct.setPhanTramGiam(dotGiamGiaDetail.getIdDotGiamGia().getGiaTriGiam());
                        giaMoi = spct.getGiaBan().multiply(BigDecimal.valueOf(1 - spct.getPhanTramGiam() / 100.0));
                    }

                    dotGiamGiaDetail.setGiaCu(spct.getGiaBan());
                    dotGiamGiaDetail.setGiaMoi(giaMoi);
                    dotGiamGiaDetail.setGiaGiam(dotGiamGiaDetail.getGiaCu().subtract(dotGiamGiaDetail.getGiaMoi()));
                    spct.setGiaMoi(giaMoi);
                } else if (dotGiamGiaDetail.getNgayKetThuc().isBefore(now)) {
                    dotGiamGiaDetail.setTrangThai("Đã kết thúc");
                    spct.setGiaBan(spct.getGiaBan());
                    dotGiamGiaDetail.setGiaCu(spct.getGiaBan());
                    dotGiamGiaDetail.setGiaMoi(dotGiamGiaDetail.getGiaCu().multiply(BigDecimal.valueOf(1 - dotGiamGiaDetail.getIdDotGiamGia().getGiaTriGiam() / 100.0)));
                    dotGiamGiaDetail.setGiaGiam(dotGiamGiaDetail.getGiaCu().subtract(dotGiamGiaDetail.getGiaMoi()));
                    spct.setPhanTramGiam(0);
                }
                chiTietSanPhamRepository.save(spct);
            }
        }

        dotGiamGiaDetailRepository.saveAll(dotGiamGiaDetailList);
    }

    @Override
    public DotGiamGia updateEndDate(Integer id) {
        DotGiamGia promotionToUpdate = dotGiamGiaRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if (promotionToUpdate.getTrangThai().equals("Đã kết thúc")) {
            throw new RestApiException("Đợt giảm giá này đã kết thúc rồi!");
        }
        if (promotionToUpdate.getTrangThai().equals("Sắp diễn ra")) {
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            promotionToUpdate.setNgayBatDau(startDate);
        }
        promotionToUpdate.setNgayKetThuc(currentDate);
        promotionToUpdate.setTrangThai("Đã kết thúc"); // Đã kết thúc
        return dotGiamGiaRepository.save(promotionToUpdate);
    }

    @Override
    public List<ChiTietSanPham> SPCT(Integer idDGG) {
        return dotGiamGiaRepository.findByAllSPCTByIdDotGiamGia(idDGG);
    }

    public boolean isCodeUnique(String code) {
        Optional<DotGiamGia> existingPromotion = dotGiamGiaRepository.findByMa(code);
        return existingPromotion.isEmpty();
    }
}
