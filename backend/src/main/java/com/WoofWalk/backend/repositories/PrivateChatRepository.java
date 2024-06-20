package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.PrivateChat;
import com.WoofWalk.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivateChatRepository extends JpaRepository<PrivateChat, Long> {
    List<PrivateChat> findByParticipantsContaining(User participant);
}
