package com.example.be.app.client_app.service.impl;


import com.example.be.app.client_app.dto.request.*;
import com.example.be.app.client_app.dto.response.*;
import com.example.be.app.client_app.repository.*;
import com.example.be.app.client_app.service.ClientProductService;
import com.example.be.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientProductServiceImpl implements ClientProductService {

    @Autowired
    private ClientProductDetailRepository clientProductDetailRepository;

    @Autowired
    private ClientBrandRepository clientBrandRepository;

    @Autowired
    private ClientCategoryRepository clientCategoryRepository;

    @Autowired
    private ClientColorRepository clientColorRepository;

    @Autowired
    private ClientMaterialRepository clientMaterialRepository;

    @Autowired
    private ClientSizeRepository clientSizeRepository;



    @Override
    public List<ClientProductResponse> getProducts(ClientProductRequest request) {
        return clientProductDetailRepository.getProducts(request);
    }

    @Override
    public List<ClientProductResponse> getAllProducts(ClientFindProductRequest request) {
        return clientProductDetailRepository.getAllProductClient(request);
    }

    @Override
    public ClientProductResponse getProductById(String id) {
        return clientProductDetailRepository.getProductById(id);
    }

    @Override
    public List<ClientProductResponse> getProductCungLoai(ClientProductCungLoaiRequest request) {
        return clientProductDetailRepository.getProductCungLoai(request);
    }

    @Override
    public ClientMinMaxPrice getMinMaxPriceProductClient() {
        return clientProductDetailRepository.getMinMaxPriceProductClient();
    }

    @Override
    public List<ClientProductResponse> getProductsHome(ClientProductRequest request) {
        return clientProductDetailRepository.getProductsHome(request);
    }

    @Override
    public List<ClientProductResponse> getSellingProduct(ClientProductRequest request) {
        return clientProductDetailRepository.getSellingProduct(request);
    }

    @Override
    public List<ClientProductResponse> getSaleProduct(ClientProductRequest request) {
        return clientProductDetailRepository.getSaleProduct(request);
    }

    @Override
    public List<ClientProductDetailResponse> getProductBySize(ClientProductDetailRequest request) {
        return clientProductDetailRepository.getAllSize(request);
    }

    @Override
    public List<ClientProductDetailResponse> getProductByColor(ClientProductDetailRequest request) {
        return clientProductDetailRepository.getAllColor(request);
    }

    @Override
    public List<Brand> getAllBrand() {
        return clientBrandRepository.findAll();
    }

    @Override
    public List<Category> getAllCategory() {
        return clientCategoryRepository.findAll();
    }

    @Override
    public List<Color> getAllColor() {
        return clientColorRepository.findAll();
    }

    @Override
    public List<Material> getAllMaterial() {
        return clientMaterialRepository.findAll();
    }

    @Override
    public List<Size> getAllSize() {
        return clientSizeRepository.findAll();
    }
}
