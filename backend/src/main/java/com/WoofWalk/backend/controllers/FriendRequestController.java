package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.services.FriendRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendRequestController {

    private final FriendRequestService friendRequestService;

    @PostMapping("/invite")
    public FriendRequest inviteFriend(@RequestBody FriendRequestDto friendRequestDto){
       return friendRequestService.createFriendRequestInDatabase(friendRequestDto);
    }
}
