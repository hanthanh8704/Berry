package com.example.be.controller;

import com.example.be.dto.request.sleeve.TayAoRequest;
import com.example.be.entity.TayAo;
import com.example.be.service.TayAoService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/sleeve") // Adjusted endpoint path to reflect sleeve management
public class TayAoController {

    private final TayAoService tayAoService;

    @Autowired
    public TayAoController(TayAoService tayAoService) {
        this.tayAoService = tayAoService;
    }

    // Get all sleeves
    @GetMapping
    public PageableObject getAll(TayAoRequest request) {
        return tayAoService.getAll(request);
    }

    // Get sleeve by ID
    @GetMapping("/{id}")
    public TayAo getOne(@PathVariable Integer id) {
        return tayAoService.getOne(id);
    }

    // Create a new sleeve
    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid TayAoRequest request) {
        return new ResponseObject(tayAoService.create(request));
    }

    // Update an existing sleeve
    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid TayAoRequest request) {
        return new ResponseObject(tayAoService.update(id, request));
    }

    // Additional methods for managing sleeves can be added here
}

