package com.example.be.dto.client.request;

import com.example.be.entities.CartDetail;
import com.example.be.entities.Customer;
import com.example.be.entities.ProductDetail;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {
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
    private List<CartDetail> listCartDetails;
}
