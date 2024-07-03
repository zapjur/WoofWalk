package com.WoofWalk.backend.dto;

import lombok.Data;

@Data
public class GroupMessageDto {

    private String sender;
    private String content;
    private long timestamp;

}
