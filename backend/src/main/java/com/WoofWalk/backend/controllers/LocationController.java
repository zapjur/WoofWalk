package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.LocationDetailsDto;
import com.WoofWalk.backend.dto.LocationDto;
import com.WoofWalk.backend.entities.Location;

import com.WoofWalk.backend.services.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;


@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
public class LocationController {

    private static final Logger logger = LoggerFactory.getLogger(LocationController.class);
    private final LocationService locationService;

    @GetMapping
    public List<LocationDto> getAllLocations() {
        List<LocationDto> allLocations = locationService.getAllLocations();
        logger.info("locations: {}", allLocations);
        return allLocations;
    }

    @PostMapping
    public ResponseEntity<Void> createLocation(@RequestBody LocationDto locationDto) {
        Location createdLocation = locationService.createLocation(locationDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{locationId}/reviews")
    public ResponseEntity<Void> rateLocation(@PathVariable Long locationId,
                                          @RequestParam("rating") int rating,
                                          @RequestParam("userEmail") String userEmail,
                                          @RequestParam(value = "opinion", required = false) String opinion,
                                          @RequestParam(value = "images", required = false) MultipartFile[] images) {
        locationService.rateLocation(userEmail, locationId, rating, opinion, images);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/details/{locationId}")
    public ResponseEntity<LocationDetailsDto> getLocationDetails(@PathVariable Long locationId) {
        LocationDetailsDto locationDetails = locationService.getLocationDetails(locationId);
        return ResponseEntity.ok(locationDetails);
    }

    @GetMapping("/image/{locationId}")
    public ResponseEntity<String> getOnePhotoForLocation(@PathVariable Long locationId) {
        return ResponseEntity.ok(locationService.getOnePhotoForLocation(locationId));
    }

    @GetMapping("/rating/{locationId}")
    public ResponseEntity<Double> getRating(@PathVariable Long locationId){
        double rating = locationService.getRating(locationId);
        return ResponseEntity.ok(rating);
    }
    @GetMapping("/ratingCount/{locationId}")
    public ResponseEntity<Integer> getRatingCount(@PathVariable Long locationId){
        int ratingCount = locationService.getRatingCount(locationId);
        return ResponseEntity.ok(ratingCount);
    }

}
