package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.services.FriendRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @PostMapping("/{friendRequestId}/accept")
    public ResponseEntity<String> acceptFriendRequest(@PathVariable Long friendRequestId){
        friendRequestService.acceptFriendRequest(friendRequestId);
        return new ResponseEntity<>("Friend request accepted", HttpStatus.OK);
    }

    @PostMapping("/{friendRequestId}/decline")
    public ResponseEntity<String> declineFriendRequest(@PathVariable Long friendRequestId){
        friendRequestService.declineFriendRequest(friendRequestId);
        return new ResponseEntity<>("Friend request declined", HttpStatus.OK);
    }

    @GetMapping("/getAllFriends")
    public Set<UserDto> getAllFriends(@RequestParam("email") String email){
        return friendRequestService.getAllFriends(email);
    }
}
