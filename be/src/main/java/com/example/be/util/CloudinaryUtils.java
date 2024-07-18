package com.example.be.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import com.example.be.util.exception.RestApiException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;


@Service
public class CloudinaryUtils {
    private Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dikkkp870",
            "api_key", "968634438423255",
            "api_secret", "NoAQ3eSE4lS8K41vbWAzOmDDgeI"));

    public String uploadSingleImage(MultipartFile file, String folder) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<String> uploadMultipleImages(List<MultipartFile> imageFiles, String folder) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = String.valueOf(uploadSingleImage(imageFile, folder));
            if (imageUrl != null) {
                imageUrls.add(imageUrl);
            }
        }
        return imageUrls;
    }

    public List<Map> getImagesInFolder(String folderName, Integer size) {
        try {
            Map<String, Object> params = ObjectUtils.asMap(
                    "type", "upload",
                    "prefix", folderName + "/",
                    "max_results", size);

            ApiResponse response = cloudinary.api().resources(params);
            List<Map> images = (List<Map>) response.get("resources");

            images.sort((image1, image2) -> {
                String createdAt1 = (String) image1.get("created_at");
                String createdAt2 = (String) image2.get("created_at");
                return Comparator.nullsFirst(String::compareTo).compare(createdAt2, createdAt1);
            });

            return images;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
