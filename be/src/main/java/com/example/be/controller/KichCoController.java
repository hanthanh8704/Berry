package com.example.be.controller;

import com.example.be.dto.request.size.KichCoRequest;
import com.example.be.entity.KichCo;
import com.example.be.repository.KichCoRepository;
import com.example.be.service.KichCoService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/size")
public class KichCoController {
    //cua duc
    @Autowired
    private KichCoRepository kichCoRepository;
    @GetMapping("/kich-co")
    public ResponseEntity<List<KichCo>> findAllKichCo() {
        List<KichCo> kichCoList = kichCoRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }

    private final KichCoService kichCoService;

    @Autowired
    public KichCoController(KichCoService kichCoService) {
        this.kichCoService = kichCoService;
    }

    // Hiển thị các danh sách kích cỡ
    @GetMapping
    public PageableObject getAll(KichCoRequest request) {
        return kichCoService.getAll(request);
    }

    // Hàm này hiển thị detail của kích cỡ
    @GetMapping("/{id}")
    public KichCo getOne(@PathVariable Integer id) {
        return kichCoService.getOne(id);
    }

    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid KichCoRequest request) {
        return new ResponseObject(kichCoService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Integer id, @RequestBody @Valid KichCoRequest request) {
        KichCo updatedMauSac = kichCoService.update(id, request);
        if (updatedMauSac != null) {
            return ResponseEntity.ok(new ResponseObject(updatedMauSac));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    //DatThanh


}
