package com.WoofWalk.backend.services;




import com.WoofWalk.backend.dto.UserInfoDto;
import com.WoofWalk.backend.entities.Event;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.EventRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserService userService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final static Logger logger = LoggerFactory.getLogger(EventService.class);

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

    public List<UserInfoDto> getAllUsers(long placeId) {
        Event event = eventRepository.findByPlaceID(placeId)
                .orElseThrow(() -> new EntityNotFoundException("No such event"));
        Set<User> users = event.getUsers();
        List<UserInfoDto> dto = new ArrayList<>();
        for(User user:users){
            String imageUri = userService.getProfilePicture(user.getEmail());
            String userEmail = user.getEmail();
            UserInfoDto userInfoDto = new UserInfoDto();
            userInfoDto.setEmail(userEmail);
            userInfoDto.setImageUri(imageUri);
            dto.add(userInfoDto);
        }
        return dto;
    }
}
