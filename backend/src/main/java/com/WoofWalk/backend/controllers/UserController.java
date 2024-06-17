package com.WoofWalk.backend.controllers;


import com.WoofWalk.backend.dto.ProfilePictureDto;
import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.services.S3Service;
import com.WoofWalk.backend.services.UserService;
import com.amazonaws.services.s3.model.S3Object;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final S3Service s3Service;

    @PostMapping("/createUser")
    public ResponseEntity<?> createUserInDatabase(@RequestBody UserDto userDto, @RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        userService.createUserInDatabase(userDto, jwtToken);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/updateAddress")
    public UserDto updateUserAddress(@RequestBody UserDto userDto){
        return userService.updateAddress(userDto);
    }

    @PostMapping("/updatePhoneNumber")
    public UserDto updatePhoneNumber(@RequestBody UserDto userDto){
        return userService.updatePhoneNumber(userDto);
    }

    @GetMapping("/getAddress")
    public String getAddress(@RequestParam("email") String email ){
        return userService.getAddress(email);
    }

    @GetMapping("/getPhoneNumber")
    public String getPhoneNumber(@RequestParam("email") String email){
        return userService.getPhoneNumber(email);
    }

    @PutMapping("/profilePicture/upload")
    public ResponseEntity<String> uploadProfilePicture(@ModelAttribute ProfilePictureDto profilePictureDto){
        String fileID = s3Service.uploadFile(profilePictureDto.getFile(), profilePictureDto.getEmail());
        userService.saveProfilePictureId(profilePictureDto.getEmail(), fileID);
        return new ResponseEntity<>("Success!", HttpStatus.OK);
    }

    @GetMapping("/profilePicture/download")
    public ResponseEntity<ByteArrayResource> getImage(@RequestParam("email") String email) throws IOException {
        try(S3Object s3Object = s3Service.downloadProfilePicture(email);){

            if(s3Object == null){
                return ResponseEntity.notFound().build();
            }
            try (InputStream inputStream = s3Object.getObjectContent()) {

                byte[] bytes = inputStream.readAllBytes();
                ByteArrayResource resource = new ByteArrayResource(bytes);

                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + email + "\"")
                        .body(resource);
            }
        }
    }
    @PostMapping("/profilePicture/delete")
    public ResponseEntity<String> deleteProfilePicture(@RequestBody UserDto userDto){
        return s3Service.deleteImage(userDto.getEmail());
    }
}
