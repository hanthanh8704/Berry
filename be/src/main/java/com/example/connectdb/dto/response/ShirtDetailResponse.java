package com.example.connectdb.dto.response;

import com.example.connectdb.entity.ChiTietSanPham;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {ChiTietSanPham.class})
public interface ShirtDetailResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();
    Integer getSanPham();
    String getMa();
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

}
