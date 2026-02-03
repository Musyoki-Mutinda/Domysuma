package com.domysuma.website.core.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
@Primary
public class StorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(StorageService.class);

    private final AmazonS3 s3Client;

    @Value("${spaces.bucket}")
    private String spacesBucket;

    @Value("${spaces.endpoint}")
    private String spacesEndpoint;

    @Value("${spaces.region}")
    private String spacesRegion;

    public StorageService(AmazonS3 s3Client) {
        this.s3Client = s3Client;
        log.info("DigitalOcean Spaces client initialized");
    }

    @Override
    public void saveFile(MultipartFile multipartFile, String filePath) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getInputStream().available());
        if (multipartFile.getContentType() != null && !"".equals(multipartFile.getContentType())) {
            metadata.setContentType(multipartFile.getContentType());
        }
        
        // Upload with public read access
        PutObjectRequest putObjectRequest = new PutObjectRequest(
            spacesBucket, 
            filePath, 
            multipartFile.getInputStream(), 
            metadata
        ).withCannedAcl(CannedAccessControlList.PublicRead);
        
        s3Client.putObject(putObjectRequest);

        // Generate and log the public URL
        String fileUrl = getPublicUrl(filePath);
        log.info("File uploaded successfully to DigitalOcean Spaces: {}", fileUrl);
    }

    @Override
    public void saveFile(File file, String filePath) {
        PutObjectRequest putObjectRequest = new PutObjectRequest(spacesBucket, filePath, file)
            .withCannedAcl(CannedAccessControlList.PublicRead);
        
        s3Client.putObject(putObjectRequest);
        
        String fileUrl = getPublicUrl(filePath);
        log.info("File uploaded successfully to DigitalOcean Spaces: {}", fileUrl);
    }

    @Override
    public InputStream getFile(String filePath) {
        return s3Client.getObject(spacesBucket, filePath).getObjectContent();
    }

    @Override
    public void deleteFile(String filePath) {
        s3Client.deleteObject(new DeleteObjectRequest(spacesBucket, filePath));
    }
    
    // Generate public URL for uploaded files
    public String getPublicUrl(String filePath) {
        return String.format("https://%s.%s/%s", 
            spacesBucket, 
            spacesEndpoint, 
            filePath
        );
    }
}