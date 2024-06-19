package com.WoofWalk.backend.controllers;


import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.services.EventService;
import com.WoofWalk.backend.services.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    @PostMapping("/addUser/{placeId}")
    public ResponseEntity<String> addUserToEvent(@PathVariable long placeId, @RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        String sub = userService.getSubFromToken(jwtToken);

        eventService.addUserToEvent(placeId, sub);
        return new ResponseEntity<>("User added to event!", HttpStatus.OK);
    }

    @PostMapping("/deleteUser/{placeId}")
    public ResponseEntity<String> deleteUserFromEvent(@PathVariable long placeId, @RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        String sub = userService.getSubFromToken(jwtToken);
        eventService.deleteUserFromEvent(placeId, sub);
        return new ResponseEntity<>("User removed from event!", HttpStatus.OK);
    }

    @GetMapping("/isUserInterested/{placeId}")
    public ResponseEntity<Boolean> isUserInterested(@PathVariable long placeId, @RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        String sub = userService.getSubFromToken(jwtToken);
        boolean isInterested = eventService.isUserInterested(placeId, sub);
        return new ResponseEntity<>(isInterested, HttpStatus.OK);
    }

    @GetMapping("/getAllUsers/{placeId}")
    public ResponseEntity<Set<String>> getAllUsers(@PathVariable long placeId){
        Set<String> interestedUsers = eventService.getAllUsers(placeId);
        return new ResponseEntity<>(interestedUsers, HttpStatus.OK);
    }

}
