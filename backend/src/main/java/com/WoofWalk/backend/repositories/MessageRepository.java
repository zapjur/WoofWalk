package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.entities.PrivateChat;
import com.WoofWalk.backend.entities.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByPrivateChat(PrivateChat privateChat);
    List<Message> findByGroupChat(GroupChat groupChat);
}
