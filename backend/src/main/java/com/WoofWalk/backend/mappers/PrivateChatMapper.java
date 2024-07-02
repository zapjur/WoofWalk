package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.PrivateChatDto;
import com.WoofWalk.backend.entities.PrivateChat;
import com.WoofWalk.backend.entities.User;

import java.util.stream.Collectors;

public class PrivateChatMapper {
    public static PrivateChatDto toDto(PrivateChat privateChat, User requestingUser) {
        PrivateChatDto dto = new PrivateChatDto();
        dto.setId(privateChat.getId());
        dto.setParticipant(privateChat.getParticipants().stream()
                .map(User::getEmail)
                .filter(email -> !email.equals(requestingUser.getEmail()))
                .findFirst()
                .orElse(null));
        return dto;
    }
}
