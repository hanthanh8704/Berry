package com.example.TuHocFullStack.service.impl;

import com.example.TuHocFullStack.entity.DotGiamGia;
import com.example.TuHocFullStack.entity.DotGiamGiaDetail;
import com.example.TuHocFullStack.entity.NhanVien;
import com.example.TuHocFullStack.entity.SPCT;
import com.example.TuHocFullStack.exception.ResourceNotFoundException;
import com.example.TuHocFullStack.mapper.NhanVienMapper;
import com.example.TuHocFullStack.repository.DotGiamGiaDetailRepository;
import com.example.TuHocFullStack.repository.DotGiamGiaRepository;
import com.example.TuHocFullStack.repository.SPCT_Repository;
import com.example.TuHocFullStack.service.DotGiamGiaService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DotGiamGiaServiceImpl implements DotGiamGiaService {

    @Autowired
    private final DotGiamGiaRepository dotGiamGiaRepository;

    @Autowired
    private final DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @Autowired
    private final SPCT_Repository spct_repository;

    @Override
    public DotGiamGia createDotGiamGia(DotGiamGia dotGiamGia) {
        dotGiamGia.setNguoiSua("Admin");
        dotGiamGia.setNguoiTao("Admin");
        dotGiamGia.setLoaiKhuyenMai("Phần trăm");

        // Cập nhật trạng thái dựa trên ngày bắt đầu và ngày kết thúc
        LocalDateTime now = LocalDateTime.now();
        if (dotGiamGia.getNgayBatDau().isAfter(now)) {
            dotGiamGia.setTrangThai("Sắp diễn ra");
        } else if (dotGiamGia.getNgayBatDau().isBefore(now) && dotGiamGia.getNgayKetThuc().isAfter(now)) {
            dotGiamGia.setTrangThai("Đang diễn ra");
        } else if (dotGiamGia.getNgayKetThuc().isBefore(now)) {
            dotGiamGia.setTrangThai("Đã kết thúc");
        } else {
            dotGiamGia.setTrangThai("Đang diễn ra");
        }

        return dotGiamGiaRepository.save(dotGiamGia);
    }

    @Override
    public List<DotGiamGia> getAllDotGiamGia() {
        return dotGiamGiaRepository.findAllOrderedByNgayTaoDesc();
    }

    @Override
    public DotGiamGia getDotGiamGiaById(Integer idDGG) {
        return dotGiamGiaRepository.findById(idDGG)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt giảm giá với id: " + idDGG));
    }

    @Override
    public DotGiamGia update(Integer idDGG, DotGiamGia updateDotGiamGia) {
        DotGiamGia dotGiamGiaDetail = dotGiamGiaRepository.findById(idDGG)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt giảm giá với id : " + idDGG));

        dotGiamGiaDetail.setTen(updateDotGiamGia.getTen());
        dotGiamGiaDetail.setMa(updateDotGiamGia.getMa());
        dotGiamGiaDetail.setLoaiKhuyenMai("Phần trăm");
        dotGiamGiaDetail.setGiaTriGiam(updateDotGiamGia.getGiaTriGiam());
        dotGiamGiaDetail.setNgayBatDau(updateDotGiamGia.getNgayBatDau());
        dotGiamGiaDetail.setNgayKetThuc(updateDotGiamGia.getNgayKetThuc());
        dotGiamGiaDetail.setNguoiTao("Admin");
        dotGiamGiaDetail.setNguoiSua("Admin");

        // Cập nhật trạng thái dựa trên ngày bắt đầu và ngày kết thúc
        LocalDateTime now = LocalDateTime.now();
        if (dotGiamGiaDetail.getNgayBatDau().isAfter(now)) {
            dotGiamGiaDetail.setTrangThai("Sắp diễn ra");
        } else if (dotGiamGiaDetail.getNgayBatDau().isBefore(now) && dotGiamGiaDetail.getNgayKetThuc().isAfter(now)) {
            dotGiamGiaDetail.setTrangThai("Đang diễn ra");
        } else if (dotGiamGiaDetail.getNgayKetThuc().isBefore(now)) {
            dotGiamGiaDetail.setTrangThai("Đã kết thúc");
        } else {
            dotGiamGiaDetail.setTrangThai("Đang diễn ra");
        }

        return dotGiamGiaRepository.save(dotGiamGiaDetail);
    }

    @Override
    public void delete(Integer idDGG) {
        DotGiamGia dotGiamGia = dotGiamGiaRepository.findById(idDGG)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt giảm giá với id: " + idDGG));
        dotGiamGiaRepository.delete(dotGiamGia);
    }


    @Override
    @Scheduled(cron = "0 0/30 * * * ?") // Chạy mỗi 30 phút
    @Transactional
    public void updateTrangThai() {
        LocalDateTime now = LocalDateTime.now();

        // Cập nhật trạng thái của DotGiamGia
        List<DotGiamGia> dotGiamGiaList = dotGiamGiaRepository.findAll();
        for (DotGiamGia dotGiamGia : dotGiamGiaList) {
            if (dotGiamGia.getNgayBatDau().isAfter(now)) {
                dotGiamGia.setTrangThai("Sắp diễn ra");
            } else if (dotGiamGia.getNgayBatDau().isBefore(now) && dotGiamGia.getNgayKetThuc().isAfter(now)) {
                dotGiamGia.setTrangThai("Đang diễn ra");
            } else if (dotGiamGia.getNgayKetThuc().isBefore(now)) {
                dotGiamGia.setTrangThai("Đã kết thúc");
            } else {
                dotGiamGia.setTrangThai("Đang diễn ra");
            }
        }
        dotGiamGiaRepository.saveAll(dotGiamGiaList);

        // Cập nhật trạng thái của DotGiamGiaDetail và điều chỉnh giá của SPCT
        List<DotGiamGiaDetail> dotGiamGiaDetailList = dotGiamGiaDetailRepository.findAll();
        for (DotGiamGiaDetail dotGiamGiaDetail : dotGiamGiaDetailList) {
            Integer idSPCT = dotGiamGiaDetail.getIdSPCT().getId();
            Optional<SPCT> spctOptional = spct_repository.findById(idSPCT);

            if (spctOptional.isPresent()) {
                SPCT spct = spctOptional.get();
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
                } else {
                    dotGiamGiaDetail.setTrangThai("Đang diễn ra");
                    // Cập nhật giá tiền của SPCT thành giá mới
                    spct.setGiaBan(dotGiamGiaDetail.getGiaMoi());
                }
                spct_repository.save(spct);
            }
        }
        dotGiamGiaDetailRepository.saveAll(dotGiamGiaDetailList);
    }


}
