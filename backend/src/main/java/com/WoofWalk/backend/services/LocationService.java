package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.LocationDto;
import com.WoofWalk.backend.entities.Location;
import com.WoofWalk.backend.entities.Rating;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.mappers.LocationMapper;
import com.WoofWalk.backend.repositories.LocationRepository;
import com.WoofWalk.backend.repositories.RatingRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final RatingRepository ratingRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    public List<LocationDto> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream()
                .map(LocationMapper::toDto)
                .collect(Collectors.toList());
    }

    public Location createLocation(LocationDto locationDto) {
        // Add validation logic here
        Location location = LocationMapper.toEntity(locationDto);
        return locationRepository.save(location);
    }

    @Transactional
    public void rateLocation(String userEmail, Long locationId, int ratingValue) {
        if (ratingValue < 1 || ratingValue > 5) {
            throw new IllegalArgumentException("Ocena musi być pomiędzy 1 a 5");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik: " + userEmail + " nie znaleziony"));

        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Lokalizacja nie znaleziona"));

        Optional<Rating> existingRating = ratingRepository.findByUserAndLocation(user, location);
        if (existingRating.isPresent()) {
            throw new IllegalStateException("Użytkownik już ocenił tę lokalizację");
        }

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setLocation(location);
        rating.setRating(ratingValue);
        ratingRepository.save(rating);

        double currRating = location.getRating();
        int currRatingCount = location.getRatingCount();
        double newRating = (currRating * currRatingCount + ratingValue) / (currRatingCount + 1);
        location.setRating(newRating);
        location.setRatingCount(currRatingCount + 1);
        locationRepository.save(location);
    }

}
