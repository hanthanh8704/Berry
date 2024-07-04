package com.example.connectdb.controller;

import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.dto.request.size.KichCoRequest;
import com.example.connectdb.entity.KichCo;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.service.KichCoService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/size")
public class KichCoController {
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
}
