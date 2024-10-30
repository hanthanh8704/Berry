package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.size.SizeRequest;
import com.example.be.entities.Size;
import com.example.be.repositories.admin.SizeRepository;
import com.example.be.services.SizeService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/size")
public class SizeController {
    private final SizeService sizeService;

    @Autowired
    public SizeController(SizeService sizeService) {
        this.sizeService = sizeService;
    }

    // Hiển thị các danh sách kích cỡ
    @GetMapping
    public PageableObject getAll(SizeRequest request) {
        return sizeService.getAll(request);
    }

    // Hàm này hiển thị detail của kích cỡ
    @GetMapping("/{id}")
    public Size getOne(@PathVariable Integer id) {
        return sizeService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid SizeRequest request) {
        return new ResponseObject(sizeService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Integer id, @RequestBody @Valid SizeRequest request) {
        Size updatedMauSac = sizeService.update(id, request);
        if (updatedMauSac != null) {
            return ResponseEntity.ok(new ResponseObject(updatedMauSac));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    //Của Đúc
    @Autowired
    private SizeRepository sizeRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Size>> getAllMaterial() {
        List<Size> sizes = sizeRepository.findAll();
        return ResponseEntity.ok(sizes);
    }
}
