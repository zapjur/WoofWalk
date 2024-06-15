package com.WoofWalk.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.WoofWalk.backend.enums.LocationCategory;

@Entity
@Getter
@Setter
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "rating")
    private double rating = 0.0;

    @Column(name = "rating_count")
    private int ratingCount = 0;

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private LocationCategory category;

    @OneToMany(mappedBy = "location")
    private List<Rating> ratings;

    @ElementCollection
    @CollectionTable(name = "location_images", joinColumns = @JoinColumn(name = "location_id"))
    @Column(name = "image_url")
    private List<String> images;
}
