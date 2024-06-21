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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtDecoder jwtDecoder;
    private final S3Service s3Service;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public Set<User> findUsersByEmails(Set<String> emails) {
        return emails.stream()
                .map(this::findByEmail)
                .collect(Collectors.toSet());
    }

    public User getUserFromToken(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        String sub = jwt.getClaimAsString("sub");
        return findBySub(sub);
    }

    public User findBySub(String sub) {
        Optional<User> user = userRepository.findBySub(sub);
        return user.orElse(null);
    }

    public String getUserSub(String email){
        Optional<User> user = userRepository.findByEmail(email);
        return user.map(User::getSub).orElse(null);
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

    public String getProfilePicture(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            User user = userOptional.get();
            String profilePictureId = user.getProfilePictureId();
            if(profilePictureId != null) {
                return s3Service.getFileUrl(profilePictureId);
            }
        }
        return null;
    }

}
