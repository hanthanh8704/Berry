package com.example.be.util.converter;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PhieuGiamGiaConvert {
    @Autowired
    private PhieuGiamGiaRepository voucherRepository;



    public PhieuGiamGia converRequestToEntity(PhieuGiamGiaRequest request){
        return PhieuGiamGia.builder()
                .ma(request.getMa())
                .ten(request.getTen())
                .soLuong(request.getSoLuong() != null ? request.getSoLuong() : 1)
                .loai(request.getLoai())
                .hinhThucGiam(request.getHinhThucGiam())
                .giaTriHoaDonDuocGiam((request.getGiaTriHoaDonDuocGiam()))
                .giaTriHoaDonDuocApDung((request.getGiaTriHoaDonDuocApDung()))
                .ngayBatDau(request.getNgayBatDau())
                .ngayKetThuc(request.getNgayKetThuc())
                .trangThai(request.getTrangThai())
                .deleted(request.getDeleted())
                .build();
    }
    public PhieuGiamGia convertRequestToEntity(Integer id, PhieuGiamGiaRequest request){
        PhieuGiamGia voucher = voucherRepository.findById(id).get();
//        voucher.setMa(request.getMa());
        voucher.setTen(request.getTen());
        voucher.setLoai(request.getLoai());
        voucher.setSoLuong(request.getSoLuong() != null ? request.getSoLuong() : 1);
//        voucher.setHinhThucGiam(request.getHinhThucGiam());
        voucher.setGiaTriHoaDonDuocGiam((request.getGiaTriHoaDonDuocGiam()));
        voucher.setGiaTriHoaDonDuocApDung((request.getGiaTriHoaDonDuocApDung()));
        voucher.setNgayBatDau(request.getNgayBatDau());
        voucher.setNgayKetThuc(request.getNgayKetThuc());
        voucher.setTrangThai(request.getTrangThai());
        return voucher;
    }
}
