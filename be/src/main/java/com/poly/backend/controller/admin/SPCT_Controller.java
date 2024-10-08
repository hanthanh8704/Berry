package com.poly.backend.controller.admin;


import com.poly.backend.entity.English.Image;
import com.poly.backend.entity.English.ProductDetail;
import com.poly.backend.entity.English.ProductDetailPromotion;

import com.poly.backend.repository.DotGiamGiaDetailRepository;
import com.poly.backend.repository.SPCT_Repository;
import com.poly.backend.repository.SanPhamRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/shirt-detail")
public class SPCT_Controller {
    @Autowired
    private SPCT_Repository spct_repository;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @Autowired
    private SanPhamRepository sanPhamRepository;


    @GetMapping("/index")
    public ResponseEntity<List<ProductDetail>> getAll() {
        List<ProductDetail> sanPhamCTList = spct_repository.findAll();

        for (ProductDetail spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Image> images = sanPhamRepository.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(images);
        }

        return ResponseEntity.ok(sanPhamCTList);
    }

    //Hien thi cua client
    @GetMapping("/sp/ban-chay")
    public ResponseEntity<List<ProductDetail>> getSPBanChay() {
        List<ProductDetail> sanPhamCTList = spct_repository.findAll();

        for (ProductDetail spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Image> images = sanPhamRepository.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(images);
        }

        return ResponseEntity.ok(sanPhamCTList);
    }


    //Hien thi cua client
    @GetMapping("/spct/{idSP}")
    public ResponseEntity<List<ProductDetail>> getAllByIdSP(@PathVariable("idSP") Integer idSP) {
        List<ProductDetail> listSpct = spct_repository.getAllByIdSP(idSP);
        return ResponseEntity.ok(listSpct);
    }

    @GetMapping("/get-one/{idSPCT}")
    public ResponseEntity<ProductDetail> findByIdSPCT(@PathVariable("idSPCT") Integer idSPCT) {
        ProductDetail Spct = spct_repository.findById(idSPCT).get();
        List<Image> images = sanPhamRepository.findAllAnhBySanPhamCTId(idSPCT);
        Spct.setImages(images);
        return ResponseEntity.ok(Spct);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailPromotion> getFirstDGGDetailByIdSPCT(@PathVariable("id") Integer idSPCT) {
        Optional<ProductDetailPromotion> dotGiamGiaDetailOptional = dotGiamGiaDetailRepository.getFirstDGGDetailByIdSPCT(idSPCT);
        return dotGiamGiaDetailOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}
