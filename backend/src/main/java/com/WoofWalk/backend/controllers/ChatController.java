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
import java.util.Date;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message sendMessage(@SessionAttribute("sub") String sub, Message message) {
        System.out.println("Received message from sub: " + sub);
        if (sub == null) {
            throw new IllegalArgumentException("Sub cannot be null");
        }

        User user = userService.findBySub(sub);
        if (user == null) {
            throw new IllegalArgumentException("User not found for sub: " + sub);
        }

        message.setSender(user.getNickname());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        return message;
    }

    @MessageMapping("/private")
    public void sendPrivateMessage(@SessionAttribute("sub") String sub, Message message) {
        System.out.println("Received private message from sub: " + sub);
        if (sub == null) {
            throw new IllegalArgumentException("Sub cannot be null");
        }

        User user = userService.findBySub(sub);
        if (user == null) {
            throw new IllegalArgumentException("User not found for sub: " + sub);
        }

        message.setSender(user.getNickname());
        message.setTimestamp(new Date().getTime());
        messageService.saveMessage(message);
        messagingTemplate.convertAndSendToUser(message.getRecipient(), "/queue/messages", message);
    }
}
