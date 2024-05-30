package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/userinfo")
    public User getUserInfo(@AuthenticationPrincipal Jwt jwt) {
        return userService.getUserInfo(jwt);
    }
}
