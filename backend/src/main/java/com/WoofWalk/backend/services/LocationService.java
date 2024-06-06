package com.WoofWalk.backend.services;

import com.WoofWalk.backend.entities.Location;
import com.WoofWalk.backend.repositories.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location createLocation(Location location) {
        // Add validation logic here
        return locationRepository.save(location);
    }
}
