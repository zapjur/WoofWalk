package com.WoofWalk.backend.dto;

import lombok.Data;

import java.util.Set;

@Data
public class PrivateChatDto {
    private Long id;
    private Set<String> participants;
}
