package com.WoofWalk.backend.controllers;


import com.WoofWalk.backend.dto.ProfilePictureDto;
import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.services.S3Service;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final static Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final S3Service s3Service;

    @PostMapping("/createUser")
    public ResponseEntity<?> createUserInDatabase(@RequestBody UserDto userDto) {
        userService.createUserInDatabase(userDto);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/updateAddress")
    public UserDto updateUserAddress(@RequestBody UserDto userDto){
        return userService.updateAddress(userDto);
    }

    @PostMapping("/updatePhoneNumber")
    public UserDto updatePhoneNumber(@RequestBody UserDto userDto){
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

    @CrossOrigin
    @PostMapping("/profilePicture/upload")
    public ResponseEntity<String> uploadProfilePicture(@ModelAttribute ProfilePictureDto profilePictureDto)  {
        logger.info("cjeabcd " + profilePictureDto.getEmail());
        logger.info("cjeabcd12 " + profilePictureDto.getFile());
        String fileID = s3Service.uploadFile(profilePictureDto.getFile());
        userService.saveProfilePictureId(profilePictureDto.getEmail(), fileID);
        return new ResponseEntity<>("Success!", HttpStatus.OK);
    }

}
