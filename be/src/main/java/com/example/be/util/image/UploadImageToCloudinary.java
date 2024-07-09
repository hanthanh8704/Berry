package com.example.be.util.image;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.be.dto.request.image.ImageColorFilerequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Configuration
public class UploadImageToCloudinary {

    @Autowired
    private Cloudinary cloudinary;

    // Ham nay dung de tải lên một danh sách các ảnh không đồng bộ và trả về một
    @Async
    public CompletableFuture<List<CloudinaryResult>> uploadImagesAsync(List<ImageColorFilerequestDTO> fileDTOs) throws InterruptedException, ExecutionException {
        List<CompletableFuture<CloudinaryResult>> futures = fileDTOs.stream()
                .map(fileDTO -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String publicId = UUID.randomUUID().toString();
                        Map<String, String> imageUploadData = new HashMap<>();
                        imageUploadData.put("public_id", publicId);

                        Map<String, Object> result = cloudinary.uploader().upload(fileDTO.getFiles().getBytes(), imageUploadData);
                        String url = extractUrlFromResult(result);
                        String color = fileDTO.getColor();

                        return new CloudinaryResult(url, color);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }))
                .collect(Collectors.toList());

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList()))
                .toCompletableFuture();
    }

    // Ham nay dung de trích xuất URL của ảnh từ kết quả trả về sau khi tải lên Cloudinary.
    private String extractUrlFromResult(Map<String, Object> result) {
        return (String) result.get("url");
    }


    // Tải lên một tệp ảnh đơn lẻ và trả về URL của ảnh đã tải lên.
    public String uploadImage(MultipartFile file) {
        try {
            // Upload file lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("url");
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed";
        }
    }

    // Tải lên một danh sách các tệp ảnh không đồng bộ và trả về một CompletableFuture
    @Async
    public CompletableFuture<List<String>> uploadImages(List<MultipartFile> files) throws InterruptedException, ExecutionException {
        List<CompletableFuture<String>> futures = files.stream()
                .map(file -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String publicId = UUID.randomUUID().toString();
                        Map<String, String> imageUploadData = new HashMap<>();
                        imageUploadData.put("public_id", publicId);
                        Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), imageUploadData);
                        return extractUrlFromResult(result);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }))
                .collect(Collectors.toList());

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList()))
                .toCompletableFuture();
    }
}
