package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.MessageDto;
import com.WoofWalk.backend.entities.Message;

public class MessageMapper {
    public static MessageDto toDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSender(message.getSender());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        return dto;
    }
}
