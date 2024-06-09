package com.WoofWalk.backend.services;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file){
        String fileID = UUID.randomUUID().toString();
        try {
            amazonS3.putObject(new PutObjectRequest(bucketName, fileID, file.getInputStream(), null)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        }
        catch (IOException e){
            throw new RuntimeException("Failed to upload a file", e);
        }
        return fileID;
    }
}
