package com.example.connectdb.controller;

import com.example.connectdb.dto.request.color.MauSacRequest;
import com.example.connectdb.entity.MauSac;
import com.example.connectdb.service.MauSacService;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/color")
public class MauSacController {
    private final MauSacService mauSacService;

    @Autowired
    public MauSacController(MauSacService mauSacService) {
        this.mauSacService = mauSacService;
    }


    @GetMapping
    public PageableObject getAll(MauSacRequest request) {
        return mauSacService.getAll(request);
    }





    @GetMapping("/{id}")
    public MauSac getOne(@PathVariable Integer id) {
        return mauSacService.getOne(id);
    }


    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid MauSacRequest request) {
        return new ResponseObject(mauSacService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Integer id, @RequestBody @Valid MauSacRequest request) {
        MauSac updatedMauSac = mauSacService.update(id, request);
        if (updatedMauSac != null) {
            return ResponseEntity.ok(new ResponseObject(updatedMauSac));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
