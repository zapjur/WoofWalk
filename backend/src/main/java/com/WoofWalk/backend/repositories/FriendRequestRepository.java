package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    Optional<FriendRequest> findFriendRequestBySenderEmail(String senderEmail);
    Optional<FriendRequest> findFriendRequestByReceiverEmail(String receiverEmail);
}
