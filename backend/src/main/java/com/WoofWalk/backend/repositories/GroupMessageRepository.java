package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.GroupChat;
import com.WoofWalk.backend.entities.GroupMessage;
import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.entities.PrivateChat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroupChat(GroupChat groupChat);
}

