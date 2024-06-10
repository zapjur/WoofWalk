package com.WoofWalk.backend.services;

import com.WoofWalk.backend.Validators.FriendRequestValidator;
import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.FriendRequestRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;
    private final FriendRequestValidator friendRequestValidator;
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
    public List<FriendRequest> getReceivedFriendRequests(String receiverEmail){
        return friendRequestRepository.findByReceiverEmail(receiverEmail);
    }

    public List<FriendRequest> getSentFriendRequests(String senderEmail){
        return friendRequestRepository.findBySenderEmail(senderEmail);
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
    public Set<UserDto> getAllFriends(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("no such user"));
        return user.getFriends().stream()
                .map(friend -> new UserDto(
                        friend.getNickname(),
                        friend.getEmail(),
                        friend.getAddress(),
                        friend.getPhoneNumber()
                ))
                .collect(Collectors.toSet());
    }
}