package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FriendRequestDto {
    private long id;
    private String senderEmail;
    private String receiverEmail;
    private String imageUri;
    private String status;


}
