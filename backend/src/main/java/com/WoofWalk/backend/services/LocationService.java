package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.LocationDetailsDto;
import com.WoofWalk.backend.dto.LocationDto;
import com.WoofWalk.backend.dto.RatingDto;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final RatingRepository ratingRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(LocationService.class);

    public List<LocationDto> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream()
                .map(LocationMapper::toDto)
                .collect(Collectors.toList());
    }

    public Location createLocation(LocationDto locationDto) {
        // Add validation logic here
        Location location = LocationMapper.toEntity(locationDto);
        location.setRating(0.0);
        location.setRatingCount(0);
        return locationRepository.save(location);
    }

    @Transactional
    public void rateLocation(String userEmail, Long locationId, int rating, String opinion, MultipartFile[] images) {
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            Location location = locationRepository.findById(locationId)
                    .orElseThrow(() -> new EntityNotFoundException("Location not found"));

            Optional<Rating> existingRatingOpt = ratingRepository.findByUserAndLocation(user, location);
            if(existingRatingOpt.isPresent()) {
                if(location.getRatingCount() == 1) {
                    location.setRating(0.0);
                    location.setRatingCount(0);
                }
                else {
                    location.setRating((location.getRating() * location.getRatingCount() - existingRatingOpt.get().getRating()) / (location.getRatingCount() - 1));
                    location.setRatingCount(location.getRatingCount() - 1);
                    ratingRepository.delete(existingRatingOpt.get());
                }

            }

            Rating newRating = new Rating();
            newRating.setLocation(location);
            newRating.setUser(user);
            newRating.setRating(rating);
            newRating.setOpinion(opinion);
            ratingRepository.save(newRating);

            location.setRating((location.getRating() * location.getRatingCount() + rating) / ((double) location.getRatingCount() + 1));
            location.setRatingCount(location.getRatingCount() + 1);

            if (images != null && images.length > 0) {
                for (MultipartFile image : images) {
                    String imageUrl = s3Service.uploadFile(image);
                    location.getImages().add(imageUrl);
                    logger.info("Added image URL: " + imageUrl);
                }
            }

            locationRepository.save(location);
        } catch (Exception e) {
            logger.error("Error rating location: ", e);
            throw new RuntimeException("Error rating location", e);
        }
    }

    public LocationDetailsDto getLocationDetails(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location not found"));

        List<RatingDto> ratings = location.getRatings().stream().map(rating -> {
            RatingDto dto = new RatingDto();
            dto.setId(rating.getId());
            dto.setUserEmail(rating.getUser().getEmail());
            dto.setRating(rating.getRating());
            dto.setOpinion(rating.getOpinion());
            return dto;
        }).collect(Collectors.toList());

        List<String> imageUrls = s3Service.getFilesUrls(location.getImages());

        LocationDetailsDto dto = new LocationDetailsDto();
        dto.setImages(imageUrls);
        dto.setRatings(ratings);

        return dto;
    }

    public String getOnePhotoForLocation(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location not found"));
        if(location.getImages().isEmpty()) {
            return null;
        }
        return s3Service.getFileUrl(location.getImages().get(0));
    }
}

