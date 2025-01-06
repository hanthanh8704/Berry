package com.example.be.app.client_app.service;


import com.example.be.app.client_app.dto.request.*;
import com.example.be.app.client_app.dto.response.*;
import com.example.be.entities.*;

import java.util.List;

public interface ClientProductService {
    List<ClientProductResponse> getProducts(ClientProductRequest request);

    List<ClientProductResponse> getAllProducts(ClientFindProductRequest request);

    ClientProductResponse getProductById(String id);

    List<ClientProductResponse> getProductsHome(ClientProductRequest request);

    List<ClientProductResponse> getSellingProduct(ClientProductRequest request);
    List<ClientProductResponse> getSaleProduct(ClientProductRequest request);

    List<ClientProductDetailResponse> getProductBySize(ClientProductDetailRequest request);
    List<ClientProductDetailResponse> getProductByColor(ClientProductDetailRequest request);

    List<Brand> getAllBrand();

    List<Category> getAllCategory();

    List<Color> getAllColor();

    List<Material> getAllMaterial();

    List<Size> getAllSize();

    List<ClientProductResponse> getProductCungLoai(ClientProductCungLoaiRequest request);

    ClientMinMaxPrice getMinMaxPriceProductClient();
}
