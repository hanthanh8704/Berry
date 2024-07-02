package com.example.connectdb.dto.response;

import com.example.connectdb.entity.ChiTietSanPham;
import com.example.connectdb.entity.CoAo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {ChiTietSanPham.class})
public interface CTSPResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();
    String getSanPham();
    String getTen();
    String getMauSac();
    String getKichCo();
    String getChatLieu();
    String getThuongHieu();
    String getTayAo();
    String getCoAo();
    Integer getSoLuong();
    BigDecimal getGiaBan();
    String getImages();
    String getTrangThai();

}
