package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.Dog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DogRepository extends JpaRepository<Dog, Long> {
    List<Dog> findByUserEmail(String userEmail);
}
