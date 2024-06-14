package com.WoofWalk.backend.services;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MessageRepository messageRepository;

    public void saveMessage(Message message){
        messageRepository.save(message);
    }
}
