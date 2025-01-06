package com.example.be.dto.admin.response;

import com.example.be.entities.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {Product.class})
public interface ShirtReponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();

    String getCode(); // Đổi từ getMa() thành getCode()

    String getName(); // Đổi từ getTen() thành getName()

    Integer getQuantity(); // Chưa có trong ProductRequest, thêm vào nếu cần

    String getStatus(); // Đổi từ getTrangThai() thành getStatus()

    String getCategory();

    LocalDateTime getCreatedAt(); // Đổi từ getNgayTao() thành getCreatedAt()

    LocalDateTime getUpdatedAt(); // Đổi từ getNgaySua() thành getUpdatedAt()
}
