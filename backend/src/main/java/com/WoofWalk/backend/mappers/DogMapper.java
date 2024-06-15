package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.DogDto;
import com.WoofWalk.backend.entities.Dog;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DogMapper {

    public static Dog toEntity(DogDto dto, UserRepository userRepository) {
        Dog dog = new Dog();
        User user = userRepository.findByEmail(dto.getUserEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        dog.setUser(user);
        dog.setName(dto.getName());
        dog.setBreed(dto.getBreed());
        dog.setBirthDate(dto.getBirthDate());
        dog.setSize(dto.getSize());
        dog.setSex(dto.getSex());

        return dog;
    }
 }
