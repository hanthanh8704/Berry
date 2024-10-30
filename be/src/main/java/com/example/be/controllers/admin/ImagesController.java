package com.example.be.controllers.admin;


import com.example.be.dto.admin.response.ImageResponse;
import com.example.be.entities.Image;
import com.example.be.repositories.admin.IImagesRepository;
import com.example.be.repositories.admin.ShirtDetailRepository;
import com.example.be.utils.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImagesController {
    @Autowired
    private IImagesRepository imagesRepository;
    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @GetMapping
    public ResponseObject create(@RequestParam String name, @RequestParam Integer shoeDetail) {
        Image images = new Image();
        images.setUrl(name);
        images.setProductDetail(shirtDetailRepository.findById(shoeDetail).get());
        return new ResponseObject(imagesRepository.save(images));
    }

    @GetMapping("/{id}")
    public List<ImageResponse> getImagesByShoeDetail(@PathVariable Integer id) {
        return imagesRepository.getImagesByProductDetail(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        imagesRepository.deleteById(id);
    }
}
