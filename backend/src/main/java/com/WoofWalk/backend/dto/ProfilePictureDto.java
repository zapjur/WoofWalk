package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProfilePictureDto {
    MultipartFile file;
    String email;

    public ProfilePictureDto(MultipartFile file, String email){
        this.file = file;
        this.email = email;
    }
}
