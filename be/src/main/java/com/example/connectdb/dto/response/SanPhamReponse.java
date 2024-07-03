package com.example.connectdb.dto.response;

import com.example.connectdb.entity.SanPham;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {SanPham.class})
public interface SanPhamReponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();
    String getMa();
    String getTen();
    String getDanhMuc();
    Integer getSoLuong ();
    String getTrangThai();



}
