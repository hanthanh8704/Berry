package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.sleeve.SleeveRequest;
import com.example.be.entities.Sleeve;
import com.example.be.services.SleeveService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/sleeve") // Adjusted endpoint path to reflect sleeve management
public class SleeveController {

    private final SleeveService sleeveService;

    @Autowired
    public SleeveController(SleeveService sleeveService) {
        this.sleeveService = sleeveService;
    }

    // Get all sleeves
    @GetMapping
    public PageableObject getAll(SleeveRequest request) {
        return sleeveService.getAll(request);
    }

    // Get sleeve by ID
    @GetMapping("/{id}")
    public Sleeve getOne(@PathVariable Integer id) {
        return sleeveService.getOne(id);
    }

    // Create a new sleeve
    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid SleeveRequest request) {
        return new ResponseObject(sleeveService.create(request));
    }

    // Update an existing sleeve
    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid SleeveRequest request) {
        return new ResponseObject(sleeveService.update(id, request));
    }

    // Additional methods for managing sleeves can be added here
}
