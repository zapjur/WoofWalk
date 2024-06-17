package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.services.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Date;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(Principal principal, Message message) {
        message.setSender(principal.getName());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        return message;
    }

    @MessageMapping("/private")
    public void sendPrivateMessage(Principal principal, Message message) {
        message.setSender(principal.getName());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        messagingTemplate.convertAndSendToUser(message.getRecipient(), "/queue/messages", message);
    }
}
