package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LocationDetailsDto {
    private List<String> images;
    private List<RatingDto> ratings;

    public LocationDetailsDto(List<String> images, List<RatingDto> ratings) {
        this.images = images;
        this.ratings = ratings;
    }
}
