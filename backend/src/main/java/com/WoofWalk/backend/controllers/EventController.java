package com.WoofWalk.backend.controllers;


import com.WoofWalk.backend.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/addUser/{placeId}")
    public ResponseEntity<String> addUserToEvent(
                            @PathVariable long placeId,
                            @RequestBody String email)
    {
        eventService.addUserToEvent(placeId, email);
        return new ResponseEntity<>("Success!", HttpStatus.OK);
    }
}
