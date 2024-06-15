package com.WoofWalk.backend.entities;

import com.WoofWalk.backend.enums.DogBreed;
import com.WoofWalk.backend.enums.DogSex;
import com.WoofWalk.backend.enums.DogSize;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Dog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private DogBreed breed;

    @Column
    private LocalDate birthDate;

    @Column
    private DogSize size;

    @Column
    private DogSex sex;

    @Column
    private String photo;
}
