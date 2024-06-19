package com.WoofWalk.backend.services;



import com.WoofWalk.backend.entities.Event;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.EventRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;


    public void createEvent(String name, Long placeId){
        Event event = new Event();
        event.setName(name);
        event.setPlaceID(placeId);
        eventRepository.save(event);
    }

    public void addUserToEvent(long placeId, String sub){

        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("No such event"));

        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("No such user"));

        Set<Event> events = user.getEvents();
        events.add(event);
        user.setEvents(events);
        userRepository.save(user);
        eventRepository.save(event);
    }

    public void deleteUserFromEvent(long placeId, String sub) {

        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("No such event"));

        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("No such user"));

        Set<Event> events = user.getEvents();
        events.remove(event);
        user.setEvents(events);
        userRepository.save(user);
        eventRepository.save(event);
    }

    public boolean isUserInterested(long placeId, String sub) {
        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("No such event"));

        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("No such user"));

        Set<Event> events = user.getEvents();
        return events.contains(event);
    }

    public Set<String> getAllUsers(long placeId) {
        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("No such event"));

        return event.getUsers().stream()
                .map(User::getEmail)
                .collect(Collectors.toSet());
    }
}