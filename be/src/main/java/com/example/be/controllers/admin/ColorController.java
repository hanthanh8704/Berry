package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.color.ColorRequest;
import com.example.be.entities.Color;
import com.example.be.repositories.admin.ColorRepository;
import com.example.be.services.ColorService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/color")
public class ColorController {
    private final ColorService colorService;

    @Autowired
    public ColorController(ColorService colorService) {
        this.colorService = colorService;
    }

    @GetMapping
    public PageableObject getAll(ColorRequest request) {
        return colorService.getAll(request);
    }

    @GetMapping("/{id}")
    public Color getOne(@PathVariable Integer id) {
        return colorService.getOne(id);
    }


    @PostMapping("/create")
    public ResponseObject create(@RequestBody @Valid ColorRequest request) {
        return new ResponseObject(colorService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> update(@PathVariable Integer id, @RequestBody @Valid ColorRequest request) {
        Color updatedMauSac = colorService.update(id, request);
        if (updatedMauSac != null) {
            return ResponseEntity.ok(new ResponseObject(updatedMauSac));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //Của Đúc
    @Autowired
    private ColorRepository colorRepository;
    @GetMapping("/index")
    public ResponseEntity<List<Color>> getAllMaterial() {
        List<Color> colors = colorRepository.findAll();
        return ResponseEntity.ok(colors);
    }

}
