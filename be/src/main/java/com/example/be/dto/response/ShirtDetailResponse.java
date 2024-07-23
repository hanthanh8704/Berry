package com.example.be.dto.response;

import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.DotGiamGia;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {ChiTietSanPham.class})
public interface ShirtDetailResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    Integer getSanPham();

    String getMaSPCT();

    String getTen();

    String getMauSac();

    String getKichCo();

    String getTayAo();

    String getCoAo();

    String getThuongHieu();

    String getChatLieu();

    Integer getSoLuong();

    BigDecimal getGiaBan();

    String getImages();

    String getTrangThai();

    BigDecimal getGiaTriDaGiam();
}
