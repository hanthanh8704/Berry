package com.poly.backend.controller.admin;

import com.poly.backend.dto.request.DotGiamGiaRequest;

import com.poly.backend.entity.English.ProductDetail;
import com.poly.backend.entity.English.Promotion;

import com.poly.backend.infrastructure.common.ResponseObject;
import com.poly.backend.repository.DotGiamGiaRepository;
import com.poly.backend.repository.SPCT_Repository;
import com.poly.backend.service.DotGiamGiaService;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@AllArgsConstructor
@CrossOrigin("*")
@RestController
@RequestMapping("/api/dot-giam-gia")
public class DotGiamGiaController {
    @Autowired
    private DotGiamGiaService dotGiamGiaService;
    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;
    @Autowired
    private SPCT_Repository spct_repository;

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
    public ResponseObject create(@RequestBody DotGiamGiaRequest request) {
        return dotGiamGiaService.create(request);
    }

    @PutMapping("/update/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody DotGiamGiaRequest request) {

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