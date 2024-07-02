package com.WoofWalk.backend.dto;

import com.WoofWalk.backend.enums.DogAge;
import com.WoofWalk.backend.enums.DogBreed;
import com.WoofWalk.backend.enums.DogSex;
import com.WoofWalk.backend.enums.DogSize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class DogDto {

    private Long id;
    private String userEmail;
    private String name;
    private DogBreed breed;
    private DogAge age;
    private DogSize size;
    private DogSex sex;

}
