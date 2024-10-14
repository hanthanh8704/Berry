package com.poly.backend.controller.admin;


import com.poly.backend.entity.English.Image;
import com.poly.backend.entity.English.Product;
import com.poly.backend.entity.English.ProductDetail;
import com.poly.backend.repository.DotGiamGiaDetailRepository;

import com.poly.backend.repository.SanPhamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/shirt")
public class SanPhamController {
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Product>> getAllSanPham() {
        List<Product> SanPhamList = sanPhamRepository.findAll();
        return ResponseEntity.ok(SanPhamList);
    }


//    @GetMapping("/{id}")
//    public ResponseEntity<List<ProductDetail>> detail(@PathVariable(name = "id") Integer idSanPham) {
//        List<ProductDetail> sanPhamCTList = sanPhamRepository.findAllSPCTBySanPhamId(idSanPham);
//
//        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
//        for (ProductDetail spct : sanPhamCTList) {
//            Integer idSPCT = spct.getId();
//            List<Image> anhList = sanPhamRepository.findAllAnhBySanPhamCTId(idSPCT);
//            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
//        }
//
//        return ResponseEntity.ok(sanPhamCTList);
//    }


    @GetMapping("/detailDGG/{id}")
    public ResponseEntity<List<ProductDetail>> detailSPCT(@PathVariable("id") Integer idSanPham) {
        List<ProductDetail> sanPhamCTList = sanPhamRepository.findAllSPCTBySanPhamId(idSanPham);

        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
        for (ProductDetail spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Image> anhList = sanPhamRepository.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
        }

        return ResponseEntity.ok(sanPhamCTList);
    }



}
