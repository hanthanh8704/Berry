package com.example.be.dto.response;

import com.example.be.entity.DiaChi;
import com.example.be.entity.KhachHang;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {DiaChi.class, KhachHang.class})
public interface DiaChiResponse {

    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();

    String getHoTen();
    String getSoDienThoai();
    String getHuyen();

    String getThanhPho();

    String getPhuong();
    Boolean getDiaChiMacDinh();

    String getDiaChiCuThe();
    String getTrangThai();
    Integer getIdKhachHang();
    String getNguoiTao();
    String getNguoiSua();

}
