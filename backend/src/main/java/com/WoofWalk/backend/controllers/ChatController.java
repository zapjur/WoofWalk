package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message){
        chatService.saveMessage(message);

        messagingTemplate.convertAndSendToUser(
                message.getReceiverEmail(),
                "/queue/messages",
                message);
    }

}
