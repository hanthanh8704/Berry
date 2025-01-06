package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.collar.CollarRequest;
import com.example.be.entities.Collar;
import com.example.be.services.CollarService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/collar") // Adjusted endpoint to manage collars
public class CollarController {

    private final CollarService collarService;

    @Autowired
    public CollarController(CollarService collarService) {
        this.collarService = collarService;
    }


    @GetMapping
    public PageableObject getAll(CollarRequest request) {
        return collarService.getAll(request);
    }


    @GetMapping("/{id}")
    public Collar getOne(@PathVariable Integer id) {
        return collarService.getOne(id);
    }


    @PostMapping("create")
    public ResponseObject create(@RequestBody @Valid CollarRequest request) {
        return new ResponseObject(collarService.create(request));
    }


    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id, @RequestBody @Valid CollarRequest request) {
        return new ResponseObject(collarService.update(id, request));
    }
}
