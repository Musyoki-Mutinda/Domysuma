package com.domysuma.website.core.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
@Primary
@Slf4j
public class AwsStorageService implements FileStorageService {
    final AmazonS3 s3Client;
    @Value("${s3.bucket}")
    private String s3Bucket;

    public AwsStorageService(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public void saveFile(MultipartFile multipartFile, String filePath) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getInputStream().available());
        if (multipartFile.getContentType() != null && !"".equals(multipartFile.getContentType())) {
            metadata.setContentType(multipartFile.getContentType());
        }
        var obj = s3Client.putObject(new PutObjectRequest(s3Bucket, filePath, multipartFile.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        log.info(obj.toString());
    }

    @Override
    public void saveFile(File file, String filePath) {
        s3Client.putObject(new PutObjectRequest(s3Bucket, filePath, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    @Override
    public InputStream getFile(String filePath) {
        return s3Client.getObject(s3Bucket, filePath).getObjectContent();
    }

    @Override
    public void deleteFile(String filePath) {
        s3Client.deleteObject(new DeleteObjectRequest(s3Bucket, filePath));
    }
}
