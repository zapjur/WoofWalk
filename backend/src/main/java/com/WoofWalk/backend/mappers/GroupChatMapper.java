package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.GroupChatDto;
import com.WoofWalk.backend.entities.GroupChat;
import com.WoofWalk.backend.entities.User;

import java.util.stream.Collectors;

public class GroupChatMapper {
    public static GroupChatDto toDto(GroupChat groupChat) {
        GroupChatDto dto = new GroupChatDto();
        dto.setId(groupChat.getId());
        dto.setName(groupChat.getName());
        dto.setMembers(groupChat.getMembers().stream()
                .map(User::getEmail)
                .collect(Collectors.toSet()));
        return dto;
    }
}
