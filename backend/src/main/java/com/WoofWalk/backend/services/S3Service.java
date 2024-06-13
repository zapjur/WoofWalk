package com.WoofWalk.backend.services;


import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.UserRepository;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final static Logger logger = LoggerFactory.getLogger(S3Service.class);
    private final AmazonS3 amazonS3;
    private final UserRepository userRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String email){
        deleteImage(email);
        String fileID = UUID.randomUUID().toString();
        File fileObj = convert(file);
        amazonS3.putObject(new PutObjectRequest(bucketName, fileID, fileObj));
        if(fileObj != null){
            fileObj.delete();
        }
        return fileID;
    }

    private File convert(MultipartFile file) {
        if(file.getOriginalFilename() != null){
            File convertedFile = new File(file.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(convertedFile)){
                fos.write(file.getBytes());
            }
            catch (IOException e){
                logger.error("Error converting a file", e);
            }
            return convertedFile;
        }
        return null;
    }

    public S3Object downloadProfilePicture(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException("no such user"));

        String imageId = user.getProfilePictureId();
        if(imageId == null){
            logger.info("No image found for user: " + email);
            return null;
        }
        return amazonS3.getObject(bucketName, imageId);
    }

    public String getFileUrl(String fileName) {
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public List<String> getFilesUrls(List<String> fileNames) {
        return fileNames.stream()
                .map(this::getFileUrl)
                .collect(Collectors.toList());
    }

    public ResponseEntity<String> deleteImage(String email){
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException("no such user"));
        String fileId = user.getProfilePictureId();
        if(fileId == null){
            return new ResponseEntity<>("Profile picture not found", HttpStatus.NOT_FOUND);
        }
        else{
           try {
               amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileId));
               user.setProfilePictureId(null);
               userRepository.save(user);
               return new ResponseEntity<>("Profile picture not found", HttpStatus.OK);
           }
           catch (Exception e){
               return new ResponseEntity<>("Failed to delete profile picture", HttpStatus.OK);
           }
        }
    }
}
