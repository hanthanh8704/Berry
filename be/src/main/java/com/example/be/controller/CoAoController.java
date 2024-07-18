package com.example.be.controller;

import com.example.be.dto.request.collar.CoAoRequest;
import com.example.be.entity.CoAo;
import com.example.be.service.CoAoService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/collar") // Adjusted endpoint to manage collars
public class CoAoController {

    private final CoAoService coAoService;

    @Autowired
    public CoAoController(CoAoService coAoService) {
        this.coAoService = coAoService;
    }


    @GetMapping
    public PageableObject getAll(CoAoRequest request) {
        return coAoService.getAll(request);
    }


    @GetMapping("/{id}")
    public CoAo getOne(@PathVariable Integer id) {
        return coAoService.getOne(id);
    }


    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid CoAoRequest request) {
        return new ResponseObject(coAoService.create(request));
    }


    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid CoAoRequest request) {
        return new ResponseObject(coAoService.update(id, request));
    }
}