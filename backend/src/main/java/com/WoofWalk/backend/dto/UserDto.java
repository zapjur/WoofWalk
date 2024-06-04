package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {

    private String nickname;
    private String email;
    private String address;
    private String phoneNumber;

    public UserDto(String nickname, String email, String address, String phoneNumber) {
        this.nickname = nickname;
        this.email = email;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }

}
