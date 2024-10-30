package com.example.be.controllers.admin;//package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.promotion.PromotionRequest;
import com.example.be.entities.ProductDetail;
import com.example.be.entities.Promotion;
import com.example.be.repositories.admin.ProductDetailRepository;
import com.example.be.repositories.admin.PromotionRepository;
import com.example.be.services.PromotionService;
import com.example.be.utils.common.ResponseObject;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/dot-giam-gia")
public class PromotionController {
    @Autowired
    private PromotionService dotGiamGiaService;
    @Autowired
    private PromotionRepository dotGiamGiaRepository;
    @Autowired
    private ProductDetailRepository spct_repository;

    @GetMapping("/index")
    public ResponseEntity<List<Promotion>> getAllDotGiamGia() {
        List<Promotion> dotGiamGiaList = dotGiamGiaRepository.findAllDotGiamGiaByNgayTaoDesc();
        return ResponseEntity.ok(dotGiamGiaList);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<List<ProductDetail>> detail(@PathVariable("id") Integer idDGG) {
        List<ProductDetail> dotGiamGiaDetail = dotGiamGiaService.SPCT(idDGG);
        return ResponseEntity.ok(dotGiamGiaDetail);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Promotion> detailDotGiamGia(@PathVariable("id") Integer idDGG) {
        Promotion dotGiamGia = dotGiamGiaRepository.findById(idDGG).get();
        return ResponseEntity.ok(dotGiamGia);
    }

    @GetMapping("/list-san-pham-id")
    public List<Integer> getListIdSanPhamDotGiamGia(@RequestParam(required = false) Integer idDGG) {
        return dotGiamGiaService.getListIdShoePromotion(idDGG);
    }

    @GetMapping("/list-san-pham-detail-id")
    public List<Integer> getListIdSanPhamDetailPromotion(@RequestParam(required = false) Integer idDGG) {
        return dotGiamGiaService.getListIdShoeDetailInPromotion(idDGG);
    }

    @PostMapping("/add")
    public ResponseObject create(@RequestBody PromotionRequest request) {
        return dotGiamGiaService.create(request);
    }

    @PutMapping("/update/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody PromotionRequest request) {

        return new ResponseObject(dotGiamGiaService.update(id, request));
    }

    @DeleteMapping("/deleted/{id}")
    public void deleteAllDotGiamGiaDetailByidDGG(@PathVariable Integer id) {
        dotGiamGiaService.deletedDotGiamGia(id);
    }

    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate(@PathVariable Integer id) {
        return new ResponseObject(dotGiamGiaService.updateEndDate(id));
    }

}
