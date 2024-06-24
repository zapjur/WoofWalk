package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserDto {

    private String nickname;
    private String email;
    private String address;
    private String phoneNumber;
    private String imageUri;

    public UserDto(String nickname, String email, String address, String phoneNumber) {
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }

}
