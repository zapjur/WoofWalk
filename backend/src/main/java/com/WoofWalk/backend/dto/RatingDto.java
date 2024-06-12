package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RatingDto {
    private Long id;
    private String userEmail;
    private int rating;
    private String opinion;

    public RatingDto(Long id, String userEmail, int rating, String opinion) {
        this.id = id;
        this.userEmail = userEmail;
        this.rating = rating;
        this.opinion = opinion;
    }
}
