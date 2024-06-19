package com.WoofWalk.backend.repositories;


import com.WoofWalk.backend.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface EventRepository extends JpaRepository<Event, Long> {

    Optional<Event> findByPlaceID(long placeID);

}
