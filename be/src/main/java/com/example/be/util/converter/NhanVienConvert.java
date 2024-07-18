package com.example.be.util.converter;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.entity.NhanVien;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.DiaChiRepository;
import com.example.be.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Optional;
import java.util.regex.Pattern;

@Component
public class NhanVienConvert {
    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private DiaChiRepository diaChiRepository;
    @Autowired
    private ChucVuRepository chucVuRepository;

    public NhanVien convertRequestToEntity(NhanVienRequest request) {
        String generatedMa = generateEmployeeCode(request.getTen());
        return NhanVien.builder()
                .ma(generatedMa)
                .ten(request.getTen())
                .diaChi(request.getDiaChi())
                .thanhPho(request.getThanhPho())
                .huyen(request.getHuyen())
                .phuong(request.getPhuong())
                .ngaySinh(request.getNgaySinh())
                .soDienThoai(request.getSoDienThoai())
                .gioiTinh(request.getGioiTinh())
                .cccd(request.getCccd())
                .email(request.getEmail())
                .chucVu(request.getIdChucVu() != null ? chucVuRepository.findById(request.getIdChucVu()).orElse(null) : null)
                .build();
    }

    private String removeAccents(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    private String generateEmployeeCode(String ten) {
        String[] parts = ten.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();

        // Lấy tên (từ cuối cùng trong parts)
        if (parts.length > 0) {
            String lastName = parts[parts.length - 1];
            sb.append(removeAccents(lastName).substring(0, Math.min(removeAccents(lastName).length(), 5)).toLowerCase());
        }

        // Lấy họ và tên đệm (các từ đầu tiên trong parts)
        for (int i = 0; i < parts.length - 1; i++) {
            String part = parts[i];
            sb.append(removeAccents(part).substring(0, 1).toLowerCase()); // Lấy ký tự đầu tiên và chuyển về lowercase
        }

        // Thêm số thứ tự để đảm bảo tính duy nhất của mã
        return getUniqueEmployeeCode(sb.toString());
    }



    private String getUniqueEmployeeCode(String baseCode) {
        int suffix = 1;
        String candidateCode = baseCode + suffix;

        // Kiểm tra tính duy nhất của mã, nếu mã đã tồn tại thì tăng suffix
        while (nhanVienRepository.existsByMa(candidateCode)) {
            suffix++;
            candidateCode = baseCode + suffix;
        }
        return candidateCode;
    }

    public NhanVien convertRequestToEntity(Integer id, NhanVienRequest request) {
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NhanVien with ID " + id + " not found"));

        nhanVien.setNgaySinh(request.getNgaySinh());
        nhanVien.setMa(request.getMa());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setTen(request.getTen());
        nhanVien.setCccd(request.getCccd());
        nhanVien.setDiaChi(request.getDiaChi());
        nhanVien.setThanhPho(request.getThanhPho());
        nhanVien.setHuyen(request.getHuyen());
        nhanVien.setPhuong(request.getPhuong());
        nhanVien.setSoDienThoai(request.getSoDienThoai());
        nhanVien.setGioiTinh(request.getGioiTinh());
        nhanVien.setTrangThai(request.getTrangThai());

        return nhanVien;
    }
}
