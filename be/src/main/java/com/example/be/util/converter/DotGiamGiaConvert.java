package com.example.be.util.converter;

import com.example.be.dto.request.dotgiamgia.DotGiamGiaRequest;
import com.example.be.entity.DotGiamGia;
import com.example.be.repository.DotGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DotGiamGiaConvert {
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

    public DotGiamGia convertRequestToEntity(DotGiamGiaRequest request){
        return DotGiamGia.builder()
                .ma(request.getMa())
                .ten(request.getTen())
                .giaTriGiam(request.getGiaTriGiam())
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .trangThai(request.getTrangThai())
                .deleted(true)
                .build();
    }

    public DotGiamGia convertRequestToEntity(DotGiamGia dotGiamGia, DotGiamGiaRequest request){
//        dotGiamGia.setMa(request.getMa());
        dotGiamGia.setTen(request.getTen());
        dotGiamGia.setGiaTriGiam(request.getGiaTriGiam());
        dotGiamGia.setNgayBatDau(request.getNgayBatDau());
        dotGiamGia.setNgayKetThuc(request.getNgayKetThuc());
        dotGiamGia.setTrangThai(request.getTrangThai());
        dotGiamGia.setDeleted(true);
        return dotGiamGia;
    }
}
