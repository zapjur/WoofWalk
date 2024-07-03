package com.WoofWalk.backend.services;

import com.WoofWalk.backend.Validators.FriendRequestValidator;
import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.dto.UserInfoDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.FriendRequestRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class FriendRequestService {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final FriendRequestValidator friendRequestValidator;
    private final UserService userService;

    private FriendRequest saveFriendRequest(FriendRequest friendRequest) {
        return friendRequestRepository.save(friendRequest);
    }
    public FriendRequest createFriendRequestInDatabase(FriendRequestDto friendRequestDto){
        friendRequestValidator.validate(friendRequestDto);
        FriendRequest friendRequest = new FriendRequest();
        friendRequest.setStatus("pending");
        friendRequest.setReceiverEmail(friendRequestDto.getReceiverEmail());
        friendRequest.setSenderEmail(friendRequestDto.getSenderEmail());
        return saveFriendRequest(friendRequest);
    }
    public List<FriendRequestDto> getReceivedFriendRequests(String receiverEmail){
        List<FriendRequest> friendRequests = friendRequestRepository.findByReceiverEmail(receiverEmail);
        List<FriendRequestDto> friendRequestDto = new ArrayList<>();
        for(FriendRequest friendRequest:friendRequests){
            FriendRequestDto dto = new FriendRequestDto();
            dto.setId(friendRequest.getId());
            dto.setSenderEmail(friendRequest.getSenderEmail());
            dto.setImageUri(userService.getProfilePicture(friendRequest.getSenderEmail()));
            friendRequestDto.add(dto);
        }
        return friendRequestDto;
    }

    public List<FriendRequestDto> getSentFriendRequests(String senderEmail){
        List<FriendRequest> friendRequests = friendRequestRepository.findBySenderEmail(senderEmail);
        List<FriendRequestDto> friendRequestDto = new ArrayList<>();
        for(FriendRequest friendRequest:friendRequests){
            FriendRequestDto dto = new FriendRequestDto();
            dto.setId(friendRequest.getId());
            dto.setReceiverEmail(friendRequest.getReceiverEmail());
            dto.setImageUri(userService.getProfilePicture(friendRequest.getReceiverEmail()));
            friendRequestDto.add(dto);
        }
        return friendRequestDto;
    }
    @Transactional
    public void acceptFriendRequest(Long friendRequestId){
        FriendRequest friendRequest = friendRequestRepository.findById(friendRequestId)
                .orElseThrow(() -> new EntityNotFoundException("Friend request not found"));

        User receiver = userRepository.findByEmail(friendRequest.getReceiverEmail())
                .orElseThrow(() -> new EntityNotFoundException("Receiver not found"));
        User sender = userRepository.findByEmail(friendRequest.getSenderEmail())
                .orElseThrow(() -> new EntityNotFoundException("Sender not found"));

        receiver.getFriends().add(sender);
        sender.getFriends().add(receiver);
        friendRequestRepository.delete(friendRequest);
        userRepository.save(receiver);
        userRepository.save(sender);
        }

    public void declineFriendRequest(Long friendRequestId){
        FriendRequest friendRequest = friendRequestRepository.findById(friendRequestId)
                .orElseThrow(() -> new EntityNotFoundException("Friend request not found"));
        friendRequestRepository.delete(friendRequest);
    }

    public Set<UserInfoDto> getAllFriends(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("no such user"));
        Set<User> friends = user.getFriends();
        Set<UserInfoDto> friendsDto = new HashSet<>();
        for(User friend:friends){
            UserInfoDto userInfoDto = new UserInfoDto();
            userInfoDto.setEmail(friend.getEmail());
            userInfoDto.setImageUri(userService.getProfilePicture(friend.getEmail()));
            friendsDto.add(userInfoDto);
        }
        return friendsDto;
    }
}