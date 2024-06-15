package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.DogDto;
import com.WoofWalk.backend.services.DogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/dogs")
@RequiredArgsConstructor
public class DogController {

    private final DogService dogService;

    @PostMapping
    public ResponseEntity<Void> createDog(@RequestBody DogDto dogDto,
                                          @RequestParam(value = "photo", required = false) MultipartFile photo){
        dogService.createDog(dogDto, photo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
