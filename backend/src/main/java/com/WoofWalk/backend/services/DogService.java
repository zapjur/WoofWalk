package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.DogDto;
import com.WoofWalk.backend.dto.DogSummaryDto;
import com.WoofWalk.backend.entities.Dog;
import com.WoofWalk.backend.mappers.DogMapper;
import com.WoofWalk.backend.repositories.DogRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DogService {

    private final DogRepository dogRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public void createDog(DogDto dogDto, MultipartFile photo) {
        Dog dog = DogMapper.toEntity(dogDto, userRepository);
        if(photo != null) {
            String photoId = s3Service.uploadFile(photo);
            dog.setPhoto(photoId);
        }
        dogRepository.save(dog);
    }

    public List<DogSummaryDto> getDogsByUserEmail(String userEmail) {
        return dogRepository.findByUserEmail(userEmail).stream()
                .map(dog -> DogMapper.toSummaryDto(dog, s3Service))
                .collect(Collectors.toList());
    }
}
