package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.UserDto;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User createUserInDatabase(UserDto userDto) {
        Optional<User> userOptional = userRepository.findByEmail(userDto.getEmail());

        return userOptional.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(userDto.getEmail());
            newUser.setNickname(userDto.getNickname());
            return saveUser(newUser);
        });
    }
}
