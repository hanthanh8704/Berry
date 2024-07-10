package com.example.be.controller;

import com.example.be.dto.request.dotgiamgia.DotGiamGiaRequest;
import com.example.be.entity.DotGiamGia;
import com.example.be.entity.DotGiamGiaDetail;
import com.example.be.repository.ChiTietSanPhamRepository;
import com.example.be.repository.DotGiamGiaRepository;
import com.example.be.service.DotGiamGiaService;
import com.example.be.util.common.ResponseObject;
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
    private ChiTietSanPhamRepository spct_repository;

    @GetMapping("/index")
    public ResponseEntity<List<DotGiamGia>> getAllDotGiamGia() {
        List<DotGiamGia> dotGiamGiaList = dotGiamGiaRepository.findAllDotGiamGiaByNgayTaoDesc();
        return ResponseEntity.ok(dotGiamGiaList);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<List<DotGiamGiaDetail>> detail(@PathVariable("id") Integer idDGG) {
        List<DotGiamGiaDetail> dotGiamGiaDetail = dotGiamGiaService.DotGiamGiaDetail(idDGG);
        return ResponseEntity.ok(dotGiamGiaDetail);
    }

    //    @GetMapping("/{id}")
//    public ResponseEntity<DotGiamGiaDto> detailDotGiamGia(@PathVariable("id") Integer idDGG) {
//        DotGiamGia dotGiamGia = dotGiamGiaRepository.findById(idDGG).orElse(null);
//        if (dotGiamGia == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        List<SPCT> spcts = spct_repository.getAllSPCTByidDGG(idDGG);
//        DotGiamGiaDto dto = new DotGiamGiaDto(dotGiamGia, spcts);
//
//        return ResponseEntity.ok(dto);
//    }
    @GetMapping("/{id}")
    public ResponseEntity<DotGiamGia> detailDotGiamGia(@PathVariable("id") Integer idDGG) {
        DotGiamGia dotGiamGia = dotGiamGiaRepository.findById(idDGG).get();
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
    public ResponseObject   create(@RequestBody DotGiamGiaRequest request) {
        return dotGiamGiaService.create(request);
    }

    @PutMapping("/update/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody DotGiamGiaRequest request) {

        return new ResponseObject(dotGiamGiaService.update(id, request));
    }

    @DeleteMapping("/delete-all-promotion-detail/{id}")
    public void deleteAllDotGiamGiaDetailByidDGG(@PathVariable Integer id) {
        dotGiamGiaService.deleteAll(id);
    }

    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate(@PathVariable Integer id) {
        return new ResponseObject(dotGiamGiaService.updateEndDate(id));
    }
}
