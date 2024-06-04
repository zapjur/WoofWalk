package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/updatePhoneNumber")
    public User updatePhoneNumber(@RequestBody UserDto userDto){
        return userService.updatePhoneNumber(userDto);
    }
    @GetMapping("/getAddress")
    public String getAddress(@RequestParam("email") String email ){
        return userService.getAddress(email);
    }
    @GetMapping("/getPhoneNumber")
    public String getPhoneNumber(@RequestParam("email") String email){
        return userService.getPhoneNumber(email);
    }
}
