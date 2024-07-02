package com.WoofWalk.backend.dto;

import lombok.Data;

import java.util.Set;

@Data
public class GroupChatDto {
    private Long id;
    private String name;
    private Set<String> members;
}
