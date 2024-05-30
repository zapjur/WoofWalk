package com.WoofWalk.backend.services;

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

    public Optional<User> findByAuth0Id(String auth0Id) {
        return userRepository.findByAuth0Id(auth0Id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User getUserInfo(Jwt jwt) {
        String auth0Id = jwt.getSubject();
        Optional<User> userOptional = findByAuth0Id(auth0Id);

        return userOptional.orElseGet(() -> {
            User newUser = new User();
            newUser.setAuth0Id(auth0Id);
            newUser.setEmail(jwt.getClaimAsString("name"));
            newUser.setUsername(jwt.getClaimAsString("nickname"));
            return saveUser(newUser);
        });
    }
}
