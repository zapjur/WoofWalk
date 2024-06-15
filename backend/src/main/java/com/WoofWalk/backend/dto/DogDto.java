package com.WoofWalk.backend.dto;

import com.WoofWalk.backend.enums.DogBreed;
import com.WoofWalk.backend.enums.DogSex;
import com.WoofWalk.backend.enums.DogSize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class DogDto {
    private Long id;
    private String userEmail;
    private String name;
    private DogBreed breed;
    private LocalDate birthDate;
    private DogSize size;
    private DogSex sex;
    private String photo;

}
