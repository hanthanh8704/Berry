package com.example.be.dto.admin.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class ImageGalleryRequest {
    List<MultipartFile> images;
    String folder;
}
