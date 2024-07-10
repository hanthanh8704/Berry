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

}
