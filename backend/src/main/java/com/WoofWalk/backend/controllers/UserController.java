package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/createUser")
    public User createUserInDatabase(@RequestBody UserDto userDto) {
        return userService.createUserInDatabase(userDto);
    }

    @PostMapping("/updateAddress")
    public User updateUserAddress(@RequestBody UserDto userDto){
        return userService.updateAddress(userDto);
    }
}
