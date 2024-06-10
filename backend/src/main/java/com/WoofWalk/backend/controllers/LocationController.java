package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.LocationDto;
import com.WoofWalk.backend.entities.Location;
import com.WoofWalk.backend.services.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    public ResponseEntity<Location> createLocation(@RequestBody LocationDto locationDto) {
        Location createdLocation = locationService.createLocation(locationDto);
        return ResponseEntity.ok(createdLocation);
    }

    @PostMapping("/{locationId}/rate")
    public ResponseEntity<?> rateLocation(@PathVariable Long locationId, @RequestBody Map<String, Object> requestBody) {
        int rating = (Integer) requestBody.get("rating");
        String userEmail = (String) requestBody.get("userEmail");
        locationService.rateLocation(userEmail, locationId, rating);
        return ResponseEntity.ok().build();
    }

}
