package com.example.connectdb.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;

import com.example.connectdb.util.exception.RestApiException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
public class CloudinaryUtils {
    private Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dqvs7ak1u",
            "api_key", "196417276159844",
            "api_secret", "IylYoqd3ilVXExMcEfd7yg8VDQI"));

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

    public String uploadSingleImage(MultipartFile imageFile, String folder) {
        try {
            Map<String, String> uploadOptions = ObjectUtils.asMap(
                    "folder", folder
            );
            Map<String, String> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), uploadOptions);
            return uploadResult.get("url");
        } catch (IOException e) {
            throw new RestApiException("Không thể tải lên hình ảnh!");
        }
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
