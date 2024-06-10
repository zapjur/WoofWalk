package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.Location;
import com.WoofWalk.backend.entities.Rating;
import com.WoofWalk.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndLocation(User user, Location location);
}
