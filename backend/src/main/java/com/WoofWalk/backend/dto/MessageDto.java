package com.WoofWalk.backend.dto;

import lombok.Data;

@Data
public class MessageDto {
    private Long id;
    private String sender;
    private String content;
    private long timestamp;
}
