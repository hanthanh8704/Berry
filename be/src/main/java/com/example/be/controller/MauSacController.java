package com.example.be.controller;

import com.example.be.dto.request.color.MauSacRequest;
import com.example.be.entity.MauSac;
import com.example.be.repository.MauSacRepository;
import com.example.be.service.MauSacService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/color")
public class MauSacController {
    //Cua Duc
    @Autowired
    private MauSacRepository mauSacRepository;

    @GetMapping("/mau-sac")
    public ResponseEntity<List<MauSac>> findAllMauSac() {
        List<MauSac> kichCoList = mauSacRepository.findAll();
        return ResponseEntity.ok(kichCoList);
    }

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
