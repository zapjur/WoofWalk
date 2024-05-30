package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Setter
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String auth0Id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

}
