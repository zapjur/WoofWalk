package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupChatRepository extends JpaRepository<GroupChat, Long> {
}
