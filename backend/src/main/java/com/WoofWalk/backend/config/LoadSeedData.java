package com.WoofWalk.backend.config;

import com.WoofWalk.backend.entities.Location;
import com.WoofWalk.backend.repositories.LocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadSeedData {

    @Bean
    CommandLineRunner initDatabase(LocationRepository locationRepository) {
        return args -> {

            String name = "Blonia";
            boolean locationExists = locationRepository.findByName(name).isPresent();

            if (!locationExists) {
                Location location = new Location();
                location.setName(name);
                location.setDescription("Fajne duze pole");
                location.setLatitude(50.0595);
                location.setLongitude(19.910139);
                location.setRating(4.5);
                location.setRatingCount(2);
                locationRepository.save(location);
            }
        };
    }

}
