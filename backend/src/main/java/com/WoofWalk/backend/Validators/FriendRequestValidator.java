package com.WoofWalk.backend.Validators;

import com.WoofWalk.backend.dto.FriendRequestDto;
import com.WoofWalk.backend.entities.FriendRequest;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.FriendRequestRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Component
public class FriendRequestValidator {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public void validate(FriendRequestDto friendRequestDto) throws IllegalArgumentException{
         String receiverEmail = friendRequestDto.getReceiverEmail();
         String senderEmail = friendRequestDto.getSenderEmail();

         if(receiverEmail == null || senderEmail == null){
             throw new IllegalArgumentException("sender or receiver email can not be null");
         }

         if(senderEmail.equals(receiverEmail)){
             throw new IllegalArgumentException("sender and receiver can not be the same");
         }

         User receiver = userRepository.findByEmail(receiverEmail).orElseThrow(
                 () -> new EntityNotFoundException("No such user"));
         User sender = userRepository.findByEmail(senderEmail).orElseThrow(
                 () -> new EntityNotFoundException("No such user"));
         Set<User> receiverFriends = receiver.getFriends();
         for(User receiverFriend:receiverFriends){
             if(receiverFriend.getId().equals(sender.getId())){
                 throw new EntityExistsException("You are already friends");
             }
         }

        List<FriendRequest> friendRequestOptional = friendRequestRepository.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail);
        if (!friendRequestOptional.isEmpty()) {
            throw new EntityExistsException("Such invitation already exists");
        }

    }
}
