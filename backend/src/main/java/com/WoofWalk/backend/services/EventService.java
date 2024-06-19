package com.WoofWalk.backend.services;


import com.WoofWalk.backend.entities.Event;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.EventRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final static Logger logger = LoggerFactory.getLogger(EventService.class);

    public void createEvent(String name, Long placeId){
        Event event = new Event();
        event.setName(name);
        event.setPlaceID(placeId);
        eventRepository.save(event);
    }
    public void addUserToEvent(long placeId, String userEmail){
        logger.info("siema " + placeId + " " + userEmail);

        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("no such event"));
        logger.info(event.getName());
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("no such user"));
        logger.info( "User email " + user.getEmail());
        Set<User> interestedUsers = event.getUsers();
        interestedUsers.add(user);
        event.setUsers(interestedUsers);
        eventRepository.save(event);
    }
}
