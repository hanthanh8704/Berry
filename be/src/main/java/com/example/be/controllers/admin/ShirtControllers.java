package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.product.ShirtRequest;
import com.example.be.dto.admin.request.product.ShirtSearchRequest;
import com.example.be.dto.admin.response.ShirtReponse;
import com.example.be.entities.Image;
import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import com.example.be.repositories.admin.ProductRepository;
import com.example.be.services.ShirtService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shirt")
public class ShirtControllers {


    @Autowired
    public ShirtControllers(ShirtService shirtService) {
        this.shirtService = shirtService;
    }

    @Autowired
    private ShirtService shirtService;


    @GetMapping("/top-sell")
    public List<ShirtReponse> getTopSell(@RequestParam(required = false, defaultValue = "5") Integer top){
        return shirtService.getTopSell(top);
    }
    @GetMapping
    public PageableObject<ShirtReponse> getAll(ShirtSearchRequest request) {
        return shirtService.getAll(request);
    }
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Integer id) {
        return shirtService.getOne(id);
    }

    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid ShirtRequest request) {
        return new ResponseObject(shirtService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid ShirtRequest request){
        return new ResponseObject(shirtService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject changeStatus(@PathVariable Integer id){
        return new ResponseObject(shirtService.changeStatus(id));
    }
    @GetMapping("/existsByTenIgnoreCase")
    public ResponseEntity<Boolean> existsByTenIgnoreCase(@RequestParam String ten) {
        boolean exists = shirtService.existsByTenIgnoreCase(ten);
        return ResponseEntity.ok(exists);
    }

    //Của Đức không được xóa
    @Autowired
    private ProductRepository productRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Product>> getAllSanPham() {
        List<Product> SanPhamList = productRepository.findAll();
        return ResponseEntity.ok(SanPhamList);
    }
//    @GetMapping("/{id}")
//    public ResponseEntity<List<ProductDetail>> detail(@PathVariable(name = "id") Integer idSanPham) {
//        List<ProductDetail> sanPhamCTList = productRepository.findAllSPCTBySanPhamId(idSanPham);
//
//        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
//        for (ProductDetail spct : sanPhamCTList) {
//            Integer idSPCT = spct.getId();
//            List<Image> anhList = productRepository.findAllAnhBySanPhamCTId(idSPCT);
//            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
//        }
//
//        return ResponseEntity.ok(sanPhamCTList);
//    }


    @GetMapping("/detailDGG/{id}")
    public ResponseEntity<List<ProductDetail>> detailSPCT(@PathVariable(name = "id") Integer idSanPham) {
        List<ProductDetail> sanPhamCTList = productRepository.findAllSPCTBySanPhamId(idSanPham);

        // Lặp qua danh sách SPCT để lấy danh sách ảnh tương ứng
        for (ProductDetail spct : sanPhamCTList) {
            Integer idSPCT = spct.getId();
            List<Image> anhList = productRepository.findAllAnhBySanPhamCTId(idSPCT);
            spct.setImages(anhList); // Gắn danh sách ảnh vào từng SPCT
        }

        return ResponseEntity.ok(sanPhamCTList);
    }

}
