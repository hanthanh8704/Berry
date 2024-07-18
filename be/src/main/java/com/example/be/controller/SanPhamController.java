package com.example.be.controller;

import com.example.be.dto.request.product.SanPhamRequest;
import com.example.be.dto.request.product.SanPhamSearchRequest;
import com.example.be.dto.response.SanPhamReponse;
import com.example.be.entity.Anh;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.SanPham;
import com.example.be.repository.DotGiamGiaDetailRepository;
import com.example.be.repository.SanPhamRepositoty;
import com.example.be.service.SanPhamService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/shirt")
public class SanPhamController {
    //Cua Duc
    @Autowired
    private SanPhamRepositoty sanPhamRepositoty;
    @Autowired
    private DotGiamGiaDetailRepository dotGiamGiaDetailRepository;

    @GetMapping("/index")
    public ResponseEntity<List<SanPham>> getAllSanPham() {
        List<SanPham> SanPhamList = sanPhamRepositoty.findAll();
        return ResponseEntity.ok(SanPhamList);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<List<ChiTietSanPham>> detail(@PathVariable(name = "id") Integer idSanPham) {
//        List<ChiTietSanPham> sanPhamCTList = sanPhamRepositoty.findAllSPCTBySanPhamId(idSanPham);
//
//        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
//        for (ChiTietSanPham spct : sanPhamCTList) {
//            Integer idSPCT = spct.getId();
//            List<Anh> anhList = sanPhamRepositoty.findAllAnhBySanPhamCTId(idSPCT);
//            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
//        }
//
//        return ResponseEntity.ok(sanPhamCTList);
//    }


    @GetMapping("/detailDGG/{id}")
    public ResponseEntity<List<ChiTietSanPham>> detailSPCT(@PathVariable(name = "id") Integer idSanPham) {
        List<ChiTietSanPham> sanPhamCTList = sanPhamRepositoty.findAllSPCTBySanPhamId(idSanPham);

        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
        for (ChiTietSanPham spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Anh> anhList = sanPhamRepositoty.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
        }

        return ResponseEntity.ok(sanPhamCTList);
    }

    @Autowired
    public SanPhamController (SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @Autowired
    private SanPhamService sanPhamService;


    @GetMapping("/top-sell")
    public List<SanPhamReponse> getTopSell(@RequestParam(required = false, defaultValue = "5") Integer top){
        return sanPhamService.getTopSell(top);
    }
    @GetMapping
    public PageableObject<SanPhamReponse> getAll(SanPhamSearchRequest request) {
        return sanPhamService.getAll(request);
    }
    @GetMapping("/{id}")
    public SanPham getOne(@PathVariable Integer id) {
        return sanPhamService.getOne(id);
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid SanPhamRequest request) {
        return new ResponseObject(sanPhamService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid SanPhamRequest request){
        return new ResponseObject(sanPhamService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject changeStatus(@PathVariable Integer id){
        return new ResponseObject(sanPhamService.changeStatus(id));
    }
    @GetMapping("/existsByTenIgnoreCase")
    public ResponseEntity<Boolean> existsByTenIgnoreCase(@RequestParam String ten) {
        boolean exists = sanPhamService.existsByTenIgnoreCase(ten);
        return ResponseEntity.ok(exists);
    }

}
