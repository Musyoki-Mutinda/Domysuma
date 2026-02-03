package com.domysuma.website.core.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpacesConfig {

    @Value("${spaces.key}")
    private String spacesKey;

    @Value("${spaces.secret}")
    private String spacesSecret;

    @Value("${spaces.endpoint}")
    private String spacesEndpoint;

    @Value("${spaces.region}")
    private String spacesRegion;

    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(spacesKey, spacesSecret);

        return AmazonS3ClientBuilder
            .standard()
            .withEndpointConfiguration(
                new AwsClientBuilder.EndpointConfiguration(
                    "https://" + spacesEndpoint,
                    spacesRegion
                )
            )
            .withCredentials(new AWSStaticCredentialsProvider(credentials))
            .build();
    }
}