package com.example.be.app.client_app.controller;

import com.example.be.app.client_app.dto.request.*;
import com.example.be.app.client_app.dto.response.*;
import com.example.be.app.client_app.service.ClientProductService;
import com.example.be.utils.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/customer")
public class ClientProductController {
    @Autowired
    private ClientProductService clientProductService;

    @GetMapping("/product")
    public ResponseObject getProduct(ClientProductRequest request) {
        return new ResponseObject((clientProductService.getProducts(request)));
    }

    @PostMapping("/all/product")
    public ResponseObject getAllProduct(@RequestBody ClientFindProductRequest request) {
        return new ResponseObject((clientProductService.getAllProducts(request)));
    }

    @GetMapping("/product/{id}")
    public ResponseObject getProductById(@PathVariable String id) {
        return new ResponseObject((clientProductService.getProductById(id)));
    }

    @GetMapping("/product/cung-loai")
    public ResponseObject getProductCungLoai(ClientProductCungLoaiRequest request) {
        return new ResponseObject((clientProductService.getProductCungLoai(request)));
    }

    @GetMapping("/product-home")
    public ResponseObject getProductHome(ClientProductRequest request) {
        return new ResponseObject((clientProductService.getProductsHome(request)));
    }

    @GetMapping("/selling-product")
    public ResponseObject getSellingProduct(ClientProductRequest request) {
        return new ResponseObject((clientProductService.getSellingProduct(request)));
    }

    @GetMapping("/sale-product")
    public ResponseObject getSaleProduct(ClientProductRequest request) {
        return new ResponseObject((clientProductService.getSaleProduct(request)));
    }

    @GetMapping("/product/size")
    public ResponseObject getProductBySize(ClientProductDetailRequest request) {
        return new ResponseObject(clientProductService.getProductBySize(request));
    }

    @GetMapping("/product/color")
    public ResponseObject getProductByColor(ClientProductDetailRequest request) {
        return new ResponseObject(clientProductService.getProductByColor(request));
    }

    @GetMapping("/brand")
    public ResponseObject getBrand() {
        return new ResponseObject(clientProductService.getAllBrand());
    }

    @GetMapping("/category")
    public ResponseObject getcategory() {
        return new ResponseObject(clientProductService.getAllCategory());
    }

    @GetMapping("/material")
    public ResponseObject getMaterial() {
        return new ResponseObject(clientProductService.getAllMaterial());
    }

    @GetMapping("/size")
    public ResponseObject getSize() {
        return new ResponseObject(clientProductService.getAllSize());
    }

    @GetMapping("/color")
    public ResponseObject getColor() {
        return new ResponseObject(clientProductService.getAllColor());
    }

    @GetMapping("/min-max-price")
    public ResponseObject getMinMaxPrice() {
        return new ResponseObject(clientProductService.getMinMaxPriceProductClient());
    }
}
