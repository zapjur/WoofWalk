package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.entities.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.messaging.handler.annotation.SendTo;

import org.springframework.stereotype.Controller;


@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message getMessage(Message message) {
        return message;
    }
}
