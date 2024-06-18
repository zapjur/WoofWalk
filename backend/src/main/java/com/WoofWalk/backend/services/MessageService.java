package com.WoofWalk.backend.services;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.repositories.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesForRecipient(String recipient) {
        return messageRepository.findByRecipient(recipient);
    }
}
