package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.mappers.UserMapper;
import com.WoofWalk.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtDecoder jwtDecoder;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findBySub(String sub) {
        Optional<User> user = userRepository.findBySub(sub);
        return user.orElse(null);
    }

    public User createUserInDatabase(UserDto userDto, String token) {
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());

        return userOptional.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(userDto.getEmail());
            newUser.setNickname(userDto.getNickname());
            newUser.setSub(getSubFromToken(token));
            return saveUser(newUser);
        });
    }

    private String getSubFromToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        return jwt.getClaimAsString("sub");
    }

    public UserDto updateAddress(UserDto userDto){
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());
        if(userOptional.isPresent()){
            User user = userOptional.get();
            user.setAddress(userDto.getAddress());
            saveUser(user);
            return UserMapper.toDto(user);

        }
        return null;
    }
    public UserDto updatePhoneNumber(UserDto userDto){
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());
        if(userOptional.isPresent()){
            User user = userOptional.get();
            user.setPhoneNumber(userDto.getPhoneNumber());
            saveUser(user);
            return UserMapper.toDto(user);
        }
        return null;
    }
    public String getAddress(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            User user = userOptional.get();
            return user.getAddress();
        }
        return null;
    }
    public String getPhoneNumber(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            User user = userOptional.get();
            return user.getPhoneNumber();
        }
        return null;
    }
    public void saveProfilePictureId(String email, String fileID){
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException("user not found"));
        user.setProfilePictureId(fileID);
        saveUser(user);
    }

}
