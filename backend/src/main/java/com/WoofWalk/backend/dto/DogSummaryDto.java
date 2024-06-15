package com.WoofWalk.backend.dto;

import com.WoofWalk.backend.enums.DogBreed;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DogSummaryDto {
    private Long id;
    private String name;
    private DogBreed breed;
    private String photo;
}
