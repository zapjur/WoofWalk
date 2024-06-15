package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.DogDto;
import com.WoofWalk.backend.dto.DogFullDto;
import com.WoofWalk.backend.dto.DogSummaryDto;
import com.WoofWalk.backend.services.DogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.List;

@RestController
@RequestMapping("/dogs")
@RequiredArgsConstructor
public class DogController {

    private final DogService dogService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createDog(@ModelAttribute DogDto dogDto,
                                          @RequestParam(value = "photo", required = false) MultipartFile photo){
        dogService.createDog(dogDto, photo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/user")
    public ResponseEntity<List<DogSummaryDto>> getDogsByUserEmail(@RequestParam String userEmail){
        return ResponseEntity.ok(dogService.getDogsByUserEmail(userEmail));
    }

    @GetMapping("/{dogId}")
    public ResponseEntity<DogFullDto> getDogById(@PathVariable Long dogId){
        return ResponseEntity.ok(dogService.getDogById(dogId));
    }

}
