package com.example.be.controllers;

import com.example.be.entities.ProductDetail;
import com.example.be.repositories.admin.ProductDetailRepository;
import com.example.be.repositories.admin.ShirtDetailRepository;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.constant.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/check-start")
public class CheckStartController {
    @Autowired
    private ShirtDetailRepository productDetailRepository;

    @GetMapping
    public ResponseObject checkStart() {
        return new ResponseObject(true);
    }

    @GetMapping("/check-quantity")
    public Boolean checkQuantity(@RequestParam String id, @RequestParam Integer quantity) {
        ProductDetail productDetail = productDetailRepository.checkQuantity(id, quantity, Status.DANG_SU_DUNG).orElse(null);
        return productDetail != null;
    }


}
