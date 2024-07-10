package com.example.be.service.impl;

import com.example.be.dto.request.dotgiamgia.DotGiamGiaRequest;
import com.example.be.dto.response.DotGiamGiaResponse;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.DotGiamGia;
import com.example.be.entity.DotGiamGiaDetail;
import com.example.be.repository.ChiTietSanPhamRepository;
import com.example.be.repository.DotGiamGiaDetailRepository;
import com.example.be.repository.DotGiamGiaRepository;
import com.example.be.service.DotGiamGiaService;
import com.example.be.util.common.ResponseObject;
import com.example.be.util.converter.DotGiamGiaConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class DotGiamGiaImpl implements DotGiamGiaService {
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @Autowired
    private ChiTietSanPhamRepository spct_repository;
    @Autowired
    private DotGiamGiaConvert dotGiamGiaConvert;

    private String genCode() {
        String prefix = "DGG00";
        int x =1 ;
        String ma = prefix +x ;
        while (dotGiamGiaRepository.existsByMa(ma)){
            x++;
            ma = prefix +x ;
        }
        return ma ;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(DotGiamGiaRequest request) {
        // Kiểm tra độ dài của mã đợt giảm giá
//        if (request.getMa().length() > 20) {
//            throw new RestApiException("Mã đợt giảm giá không được vượt quá 20 kí tự.");
//        }

        // Kiểm tra tính duy nhất của mã đợt giảm giá
//        if (!isCodeUnique(request.getMa())) {
//            throw new RestApiException("Mã đợt giảm giá đã tồn tại");
//        }

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

        request.setMa(genCode());
        // Lưu đợt giảm giá vào cơ sở dữ liệu
        DotGiamGia dotGiamGiaSave = dotGiamGiaRepository.save(dotGiamGiaConvert.convertRequestToEntity(request));

        // Cập nhật trạng thái khuyến mãi
        updateStatusPromotion();

        // Tạo danh sách chứa các id sản phẩm
//        List<Integer> getProductDetails = new ArrayList<>();
//        getProductDetails.add(2);

        // Kiểm tra và xóa các chi tiết đợt giảm giá trùng lặp
        for (Integer x : request.getProductDetails()) {
            DotGiamGiaDetail check = dotGiamGiaDetailRepository.findBySanPhamDetailId(x);
            if (check != null) {
                dotGiamGiaDetailRepository.delete(check);
            }
        }

        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {
            ChiTietSanPham sanPhamDetail = spct_repository.findById(x).get();
            BigDecimal giaCu = sanPhamDetail.getGiaBan();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - request.getGiaTriGiam() / 100.0));

            DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
            dotGiamGiaDetail.setIdDotGiamGia(dotGiamGiaSave);
            dotGiamGiaDetail.setIdSPCT(sanPhamDetail);
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

//        if (request.getMa().length() > 20) {
//            throw new RestApiException("Mã đợt giảm giá không được vượt quá 20 kí tự.");
//        }

//        if (!dotGiamGia.getMa().equalsIgnoreCase(request.getMa())) {
//            if (!isCodeUnique(request.getMa())) {
//                throw new RestApiException("Mã đợt giảm giá đã tồn tại");
//            }
//        }


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

//        List<Integer> getProductDetails = new ArrayList<>();
//        getProductDetails.add(4);

        // Kiểm tra và xóa các chi tiết đợt giảm giá trùng lặp
        for (Integer x : request.getProductDetails()) {
            DotGiamGiaDetail check = dotGiamGiaDetailRepository.findBySanPhamDetailId(x);
            if (check != null) {
                dotGiamGiaDetailRepository.delete(check);
            }
        }

        // Thêm chi tiết đợt giảm giá mới
        for (Integer x : request.getProductDetails()) {
            ChiTietSanPham sanPhamDetail = spct_repository.findById(x).get();
            BigDecimal giaCu = sanPhamDetail.getGiaBan();
            BigDecimal giaMoi = giaCu.multiply(BigDecimal.valueOf(1 - request.getGiaTriGiam() / 100.0));

            DotGiamGiaDetail dotGiamGiaDetail = new DotGiamGiaDetail();
            dotGiamGiaDetail.setIdDotGiamGia(dotGiamGiaSave);
            dotGiamGiaDetail.setIdSPCT(sanPhamDetail);
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
    public void updateStatusPromotion() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<DotGiamGia> promotions = dotGiamGiaRepository.findAll();
        for (DotGiamGia dotGiamGia : promotions) {
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

    @Override
    public void updateStatusDotGiamGiaDetail() {
        LocalDateTime now = LocalDateTime.now();
        List<DotGiamGiaDetail> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findAll();
        for (DotGiamGiaDetail dotGiamGiaDetail : dotGiamGiaDetailList) {
            Integer idSPCT = dotGiamGiaDetail.getIdSPCT().getId();
            Optional<ChiTietSanPham> spctOptional = spct_repository.findById(idSPCT);

            if (spctOptional.isPresent()) {
                ChiTietSanPham spct = spctOptional.get();
                if (dotGiamGiaDetail.getNgayBatDau().isAfter(now)) {
                    dotGiamGiaDetail.setTrangThai("Sắp diễn ra");
                    // Cập nhật giá tiền của SPCT thành giá cũ
                    spct.setGiaBan(dotGiamGiaDetail.getGiaCu());
                } else if (dotGiamGiaDetail.getNgayBatDau().isBefore(now) && dotGiamGiaDetail.getNgayKetThuc().isAfter(now)) {
                    dotGiamGiaDetail.setTrangThai("Đang diễn ra");
                    // Cập nhật giá tiền của SPCT thành giá mới
                    spct.setGiaBan(dotGiamGiaDetail.getGiaMoi());
                } else if (dotGiamGiaDetail.getNgayKetThuc().isBefore(now)) {
                    dotGiamGiaDetail.setTrangThai("Đã kết thúc");
                    // Cập nhật giá tiền của SPCT thành giá cũ
                    spct.setGiaBan(dotGiamGiaDetail.getGiaCu());
                }
                spct_repository.save(spct);
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
    public List<DotGiamGiaDetail> DotGiamGiaDetail(Integer idDGG) {
        return dotGiamGiaRepository.findByAllIdDotGiamGia(idDGG);
    }

    public boolean isCodeUnique(String code) {
        Optional<DotGiamGia> existingPromotion = dotGiamGiaRepository.findByMa(code);
        return existingPromotion.isEmpty();
    }
}
