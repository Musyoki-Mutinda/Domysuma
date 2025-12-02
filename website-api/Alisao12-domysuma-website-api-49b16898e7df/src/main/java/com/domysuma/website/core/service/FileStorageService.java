package com.domysuma.website.core.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public interface FileStorageService {
    void saveFile(MultipartFile multipartFile, String key) throws IOException;

    void saveFile(File file, String filePath);

    InputStream getFile(String filePath);

    void deleteFile(String filePath);
}
