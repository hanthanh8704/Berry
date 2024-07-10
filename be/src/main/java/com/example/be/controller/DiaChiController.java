package com.example.be.controller;

import com.example.be.dto.request.khachHang.DiaChiRequest;
import com.example.be.dto.response.DiaChiResponse;
import com.example.be.service.DiaChiService;
import com.example.be.util.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/address")
public class DiaChiController {
    @Autowired
    private DiaChiService addressService;

    @GetMapping("/{idkh}")
    public Page<DiaChiResponse> getByAccount(@PathVariable("idkh") Integer id, DiaChiRequest request) {
        return addressService.getByAccount(id, request);
    }

    @PostMapping
    public ResponseObject create(@RequestBody DiaChiRequest request) {
        return new ResponseObject(addressService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") Integer id, @RequestBody DiaChiRequest request) {
        return new ResponseObject(addressService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") Integer id) {
        return new ResponseObject(addressService.delete(id));
    }
}
