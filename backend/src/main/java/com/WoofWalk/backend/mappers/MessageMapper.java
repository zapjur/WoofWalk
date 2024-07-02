package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.GroupMessageDto;
import com.WoofWalk.backend.dto.MessageDto;
import com.WoofWalk.backend.entities.GroupMessage;
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

    public static GroupMessage groupMessageDtoToEntity(GroupMessageDto groupMessageDto) {
        GroupMessage groupMessage = new GroupMessage();
        groupMessage.setSender(groupMessageDto.getSender());
        groupMessage.setContent(groupMessageDto.getContent());
        groupMessage.setTimestamp(groupMessageDto.getTimestamp());
        return groupMessage;
    }

    public static GroupMessageDto groupMessageToDto(GroupMessage groupMessage) {
        GroupMessageDto dto = new GroupMessageDto();
        dto.setSender(groupMessage.getSender());
        dto.setContent(groupMessage.getContent());
        dto.setTimestamp(groupMessage.getTimestamp());
        return dto;
    }
}
