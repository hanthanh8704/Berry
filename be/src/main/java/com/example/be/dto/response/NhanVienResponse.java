package com.example.be.dto.response;

import com.example.be.entity.NhanVien;
import org.springframework.data.rest.core.config.Projection;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

@Projection(types = {NhanVien.class})
public interface NhanVienResponse {
    @Value("#{target.indexs}")
    Integer getInteger();

    String getChucVu();

    Integer getId();

    String getAnh();

    String getMa();

    String getTen();

    String getDiaChi();

    String getHuyen();

    String getThanhPho();

    String getPhuong();

    Date getNgaySinh();

    String getSoDienThoai();

    String getGioiTinh();

    String getEmail();

    String getCccd();

    Boolean getDeleted();

    String getTrangThai();
}
