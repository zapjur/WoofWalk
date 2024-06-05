package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.repositories.FriendRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;

    private FriendRequest saveFriendRequest(FriendRequest friendRequest) {
        return friendRequestRepository.save(friendRequest);
    }
    public FriendRequest createFriendRequestInDatabase(FriendRequestDto friendRequestDto){
        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setStatus("pending");
        friendRequest.setReceiverEmail(friendRequestDto.getReceiverEmail());
        friendRequest.setSenderEmail(friendRequestDto.getSenderEmail());
        return saveFriendRequest(friendRequest);
    }
}
