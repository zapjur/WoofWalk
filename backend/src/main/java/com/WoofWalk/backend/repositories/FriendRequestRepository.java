package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiverEmail(String receiverEmail);
    List<FriendRequest> findBySenderEmail(String senderEmail);
}
