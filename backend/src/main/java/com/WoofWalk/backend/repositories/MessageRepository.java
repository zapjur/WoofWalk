package com.WoofWalk.backend.repositories;

import com.WoofWalk.backend.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
