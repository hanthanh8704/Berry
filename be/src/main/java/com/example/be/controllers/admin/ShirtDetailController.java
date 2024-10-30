package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.ShirtDetailRequest;
import com.example.be.dto.admin.request.productDetail.UpdateShirtDetailRequest;
import com.example.be.entities.Image;
import com.example.be.entities.ProductDetail;
import com.example.be.entities.ProductDetailPromotion;
import com.example.be.repositories.admin.ProductDetailPromotionRepository;
import com.example.be.repositories.admin.ProductDetailRepository;
import com.example.be.repositories.admin.ProductRepository;
import com.example.be.services.ShirtDetailService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shirt-detail")
public class ShirtDetailController {

    @Autowired
    private ShirtDetailService shoeDetailService;

    @GetMapping
    public PageableObject getAll(FindShirtDetailRequest request) {
        return shoeDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public ProductDetail getOne(@PathVariable Integer id) {
        return shoeDetailService.getOne(id);
    }

    @GetMapping("/get-one/{id}")
    public ResponseObject getOneShoeDetail(@PathVariable Integer id) {
        return new ResponseObject(shoeDetailService.getOneShoeDetail(id));
    }

    @GetMapping("/find-min-max-price")
    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return shoeDetailService.findMinAndMaxPrice();
    }

    @PostMapping
    public ResponseObject create(@RequestBody List<ShirtDetailRequest> list) {
        return new ResponseObject(shoeDetailService.create(list));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid UpdateShirtDetailRequest request) {
        return new ResponseObject(shoeDetailService.update(id, request));
    }

    @PutMapping("/update-fast")
    public ResponseObject updateFast(@RequestBody List<ShirtDetailRequest> list) {
        list.forEach(request -> System.out.println(request));
        return new ResponseObject(shoeDetailService.updateFast(list));
    }

    //Cua Duc
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private ProductDetailPromotionRepository productDetailPromotionRepository;


    @GetMapping("/index")
    public ResponseEntity<List<ProductDetail>> getAll() {
        List<ProductDetail> sanPhamCTList = productDetailRepository.findAll();

        for (ProductDetail spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Image> images = productRepository.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(images);
        }

        return ResponseEntity.ok(sanPhamCTList);
    }

    @GetMapping("/product-detail/{id}")
    public ResponseEntity<ProductDetailPromotion> getFirstDGGDetailByIdSPCT(@PathVariable("id") Integer idSPCT) {
        Optional<ProductDetailPromotion> dotGiamGiaDetailOptional = productDetailPromotionRepository.getFirstDGGDetailByIdSPCT(idSPCT);
        return dotGiamGiaDetailOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
