package com.example.be.dto.admin.request.product;


import com.example.be.utils.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/*
 *  Hàm này dùng để tìm kiếm hóa đơn
 *
 * */
@Getter
@Setter
@Builder
public class ShirtSearchRequest extends PageableRequest {
    private Integer id;
    private String name; // Đổi từ 'ten' thành 'name'
    private String color; // Đổi từ 'mauSac' thành 'color'
    private String size; // Đổi từ 'kichCo' thành 'size'
    private String material; // Đổi từ 'chatLieu' thành 'material'
    private String brand; // Đổi từ 'thuongHieu' thành 'brand'
    private String sleeve; // Đổi từ 'tayAo' thành 'sleeve'
    private String collar; // Đổi từ 'coAo' thành 'collar'
    private String category;
    private Integer quantity; // Đổi từ 'soLuong' thành 'quantity'
    private BigDecimal minPrice; // Giữ nguyên vì đã là tiếng Anh
    private BigDecimal maxPrice; // Giữ nguyên vì đã là tiếng Anh
    private String status; // Đổi từ 'trangThai' thành 'status'

}
