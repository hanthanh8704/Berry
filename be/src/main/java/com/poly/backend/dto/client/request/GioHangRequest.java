package com.poly.backend.dto.client.request;

import com.poly.backend.entity.English.Cart_detail;
import com.poly.backend.entity.English.Customer;
import com.poly.backend.entity.English.ProductDetail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GioHangRequest {

    private Integer id;

    private Customer customer;
    private Integer customerId;
    private String code;

    private LocalDateTime createdAt;

    private String status;

    private Integer quantity;

    private Integer spctId;
    private ProductDetail spct;
    private List<Integer> idGHCT;
    private List<Cart_detail> listCartDetails;

}
