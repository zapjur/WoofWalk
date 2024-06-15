package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.Dog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DogRepository extends JpaRepository<Dog, Long> {
}
