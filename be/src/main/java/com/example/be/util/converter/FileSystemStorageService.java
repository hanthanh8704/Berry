package com.example.be.util.converter;

import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


@Service
public class FileSystemStorageService implements StorageService {


    private final Path rootPath;

    public FileSystemStorageService() {
        this.rootPath = Paths.get("src/main/resources/static/uploads");
    }

    @Override
    public void store(MultipartFile file) {
        try {
            Path destinationFile = this.rootPath.resolve(Paths.get(file.getOriginalFilename())).normalize().toAbsolutePath();
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void init() {
        try {
            Files.createDirectory(rootPath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


