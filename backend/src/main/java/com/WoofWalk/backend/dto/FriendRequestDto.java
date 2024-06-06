package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestDto {
    private String senderEmail;
    private String receiverEmail;
    private String status;

    public FriendRequestDto(String senderEmail, String receiverEmail, String status){
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.status = status;
    }
}
