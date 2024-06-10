package com.WoofWalk.backend.mappers;

import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.User;

public class UserMapper {

    public static User toEntity(UserDto dto) {
        User user = new User();
        user.setNickname(dto.getNickname());
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setPhoneNumber(dto.getPhoneNumber());
        return user;
    }

    public static UserDto toDto(User entity) {
        return new UserDto(
                entity.getNickname(),
                entity.getEmail(),
                entity.getAddress(),
                entity.getPhoneNumber()
        );
    }
}
