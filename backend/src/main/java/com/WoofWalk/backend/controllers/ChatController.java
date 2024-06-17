package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.services.MessageService;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.SessionAttribute;

import java.security.Principal;
import java.util.Date;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(Principal principal, Message message) {
        System.out.println("Received message from sub: " + principal.getName());
        if (principal == null) {
            throw new IllegalArgumentException("Principal cannot be null");
        }

        User user = userService.findBySub(principal.getName());
        if (user == null) {
            throw new IllegalArgumentException("User not found for sub: " + principal.getName());
        }

        message.setSender(user.getEmail());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        return message;
    }

    @MessageMapping("/private")
    public void sendPrivateMessage(Principal principal, Message message) {
        System.out.println("Received private message from sub: " + principal.getName());
        if (principal == null) {
            throw new IllegalArgumentException("Principal cannot be null");
        }

        User user = userService.findBySub(principal.getName());
        if (user == null) {
            throw new IllegalArgumentException("User not found for sub: " + principal.getName());
        }

        message.setSender(user.getEmail());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        messagingTemplate.convertAndSendToUser(message.getRecipient(), "/queue/messages", message);
    }
}