package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.services.FriendRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendRequestController {

    private final FriendRequestService friendRequestService;

    @PostMapping("/invite")
    public FriendRequest inviteFriend(@RequestBody FriendRequestDto friendRequestDto){
       return friendRequestService.createFriendRequestInDatabase(friendRequestDto);
    }

    @GetMapping("/receivedFriendRequests")
    public List<FriendRequest> getReceivedFriendRequests(
            @RequestParam("receiverEmail") String receiverEmail){
        return friendRequestService.getReceivedFriendRequests(receiverEmail);
    }

    @GetMapping("/sentFriendRequests")
    public List<FriendRequest> getSentFriendRequests(
            @RequestParam("senderEmail") String senderEmail
    ){
        return friendRequestService.getSentFriendRequests(senderEmail);
    }
}
