package com.example.be.controller;

import com.example.be.dto.response.ImageResponse;
import com.example.be.entity.Anh;
import com.example.be.repository.ChiTietSanPhamRepository;
import com.example.be.repository.IImagesRepository;
import com.example.be.util.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImagesController {
    @Autowired
    private IImagesRepository imagesRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @GetMapping
    public ResponseObject create(@RequestParam String name, @RequestParam Integer shoeDetail) {
        Anh images = new Anh();
        images.setTen(name);
        images.setChiTietSanPham(chiTietSanPhamRepository.findById(shoeDetail).get());
        return new ResponseObject(imagesRepository.save(images));
    }

    @GetMapping("/{id}")
    public List<ImageResponse> getImagesByShoeDetail(@PathVariable Integer id) {
        return imagesRepository.getImagesByShoeDetail(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        imagesRepository.deleteById(id);
    }
}