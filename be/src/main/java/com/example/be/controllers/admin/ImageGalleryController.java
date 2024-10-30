package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.ImageGalleryRequest;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/image-gallery")
public class ImageGalleryController {
    @Autowired
    private CloudinaryUtil cloudinaryUtils;

    @GetMapping("/{folderName}")
    public List<Map> getImagesInFolder(@PathVariable String folderName,
                                       @RequestParam(required = false, defaultValue = "50") Integer size) {
        return cloudinaryUtils.getImagesInFolder(folderName, size);
    }

    @PostMapping
    public List<String> uploadImage(@ModelAttribute ImageGalleryRequest request) {
        List<String> url = cloudinaryUtils.uploadMultipleImages(request.getImages(), request.getFolder());
        if (url.isEmpty())
            return new ArrayList<>();
        else
            return url;
    }
}
