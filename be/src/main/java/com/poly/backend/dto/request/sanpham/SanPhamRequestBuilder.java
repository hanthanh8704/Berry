package com.poly.backend.dto.request.sanpham;

import com.poly.backend.infrastructure.common.PageRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
@Builder
public class SanPhamRequestBuilder extends PageRequest{
    private Integer id;
    private String ten;


}
