package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.DogDto;
import com.WoofWalk.backend.dto.DogFullDto;
import com.WoofWalk.backend.dto.DogSummaryDto;
import com.WoofWalk.backend.entities.Dog;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.UserRepository;
import com.WoofWalk.backend.services.S3Service;
import jakarta.persistence.EntityNotFoundException;


public class DogMapper {

    public static Dog toEntity(DogDto dto, UserRepository userRepository) {
        Dog dog = new Dog();
        User user = userRepository.findByEmail(dto.getUserEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        dog.setUser(user);
        dog.setName(dto.getName());
        dog.setBreed(dto.getBreed());
        dog.setAge(dto.getAge());
        dog.setSize(dto.getSize());
        dog.setSex(dto.getSex());

        return dog;
    }

    public static DogSummaryDto toSummaryDto(Dog entity, S3Service s3Service) {
        DogSummaryDto dto = new DogSummaryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setBreed(entity.getBreed());
        if(entity.getPhoto() == null) {
            dto.setPhoto(null);
            return dto;
        }
        String photoUrl = s3Service.getFileUrl(entity.getPhoto());
        dto.setPhoto(photoUrl);
        return dto;
    }

    public static DogFullDto toFullDto(Dog entity, S3Service s3Service) {
        DogFullDto dto = new DogFullDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setBreed(entity.getBreed());
        dto.setAge(entity.getAge());
        dto.setSize(entity.getSize());
        dto.setSex(entity.getSex());
        dto.setUserEmail(entity.getUser().getEmail());
        if(entity.getPhoto() == null) {
            dto.setPhoto(null);
            return dto;
        }
        String photo = s3Service.getFileUrl(entity.getPhoto());
        dto.setPhoto(photo);
        return dto;
    }
 }
