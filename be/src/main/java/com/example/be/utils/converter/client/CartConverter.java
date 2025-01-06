package com.example.be.utils.converter.client;//package com.example.be.utils.converter;
import com.example.be.dto.client.request.CartRequest;
import com.example.be.entities.Cart;
import com.example.be.repositories.client.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;



@Component
public class CartConverter {
    @Autowired
    private CartRepository gioHangRepository;

    public Cart convertRequestToEntity(CartRequest request) {
        return Cart.builder()
                .code(request.getCode())
                .createdAt(request.getCreatedAt())
                .customer(request.getCustomer())
                .status("Hoạt động")
                .build();
    }

    public Cart convertRequestToEntity(Cart Cart, CartRequest request) {
        Cart.setCode(request.getCode());
        Cart.setCreatedAt(request.getCreatedAt());
        Cart.setStatus("Hoạt động");
        return Cart;
    }
}
