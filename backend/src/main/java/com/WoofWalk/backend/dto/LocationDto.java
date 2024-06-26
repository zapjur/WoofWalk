package com.WoofWalk.backend.dto;

import com.WoofWalk.backend.enums.LocationCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LocationDto {

        private Long id;
        private String name;
        private String description;
        private double rating;
        private int ratingCount;
        private double latitude;
        private double longitude;
        private String date;
        private LocationCategory category;

        public LocationDto(String name, String description, double rating, int ratingCount, double latitude, double longitude, String date) {
            this.name = name;
            this.description = description;
            this.rating = rating;
            this.ratingCount = ratingCount;
            this.latitude = latitude;
            this.longitude = longitude;
            this.date = date;
        }

        public LocationDto(Long id, String name, String description, double rating, int ratingCount, double latitude, double longitude, String date) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.rating = rating;
            this.ratingCount = ratingCount;
            this.latitude = latitude;
            this.longitude = longitude;
            this.date = date;
        }
}
