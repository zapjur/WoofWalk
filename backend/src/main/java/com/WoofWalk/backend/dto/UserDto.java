package com.WoofWalk.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {

    private String nickname;
    private String email;

    public UserDto(String nickname, String email) {
        this.nickname = nickname;
        this.email = email;
    }
}
