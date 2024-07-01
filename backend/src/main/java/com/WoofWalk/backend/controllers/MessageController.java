package com.WoofWalk.backend.controllers;

import com.WoofWalk.backend.dto.GroupChatDto;
import com.WoofWalk.backend.dto.MessageDto;
import com.WoofWalk.backend.dto.PrivateChatDto;
import com.WoofWalk.backend.entities.GroupChat;
import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.entities.PrivateChat;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.mappers.GroupChatMapper;
import com.WoofWalk.backend.mappers.MessageMapper;
import com.WoofWalk.backend.mappers.PrivateChatMapper;
import com.WoofWalk.backend.services.MessageService;
import com.WoofWalk.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @PostMapping("/private/{privateChatId}")
    public ResponseEntity<MessageDto> savePrivateMessage(@RequestBody Message message, @PathVariable Long privateChatId) {
        logger.info("Received private message to save: {}", message.toString());
        Message savedMessage = messageService.savePrivateMessage(message, privateChatId);
        return ResponseEntity.ok(MessageMapper.toDto(savedMessage));
    }

    @PostMapping("/group/{groupChatId}")
    public ResponseEntity<MessageDto> saveGroupMessage(@RequestBody Message message, @PathVariable Long groupChatId) {
        logger.info("Received group message to save: {}", message.toString());
        Message savedMessage = messageService.saveGroupMessage(message, groupChatId);
        return ResponseEntity.ok(MessageMapper.toDto(savedMessage));
    }

    @GetMapping("/private/{privateChatId}")
    public ResponseEntity<List<MessageDto>> getMessagesInPrivateChat(@PathVariable Long privateChatId) {
        logger.info("Fetching messages in private chat with ID: {}", privateChatId);
        List<MessageDto> messages = messageService.getMessagesInPrivateChat(privateChatId)
                .stream()
                .map(MessageMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/group/{groupChatId}")
    public ResponseEntity<List<MessageDto>> getMessagesInGroupChat(@PathVariable Long groupChatId) {
        logger.info("Fetching messages in group chat with ID: {}", groupChatId);
        List<MessageDto> messages = messageService.getMessagesInGroupChat(groupChatId)
                .stream()
                .map(MessageMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/group/userSubs/{groupChatId}")
    public ResponseEntity<Map<String, String>> getGroupChatUserSubs(@PathVariable Long groupChatId) {
        logger.info("Fetching user subs in group chat with ID: {}", groupChatId);
        Map<String, String> userSubs = messageService.getGroupChatUserSubs(groupChatId);
        logger.info("User subs in group chat with ID {}: {}", groupChatId, userSubs);
        return ResponseEntity.ok(userSubs);
    }

    @PostMapping("/private/create")
    public ResponseEntity<PrivateChatDto> createPrivateChat(@RequestHeader("Authorization") String token, @RequestParam String user2Email) {
        String jwtToken = token.replace("Bearer ", "");
        User user1 = userService.getUserFromToken(jwtToken);
        User user2 = userService.findByEmail(user2Email);
        PrivateChat privateChat = messageService.createPrivateChat(user1, user2);
        return ResponseEntity.ok(PrivateChatMapper.toDto(privateChat, user1));
    }

    @PostMapping("/group/create")
    public ResponseEntity<GroupChatDto> createGroupChat(@RequestHeader("Authorization") String token, @RequestParam String name, @RequestBody Set<String> emails) {
        String jwtToken = token.replace("Bearer ", "");
        User user1 = userService.getUserFromToken(jwtToken);
        Set<User> members = userService.findUsersByEmails(emails);
        members.add(user1);
        GroupChat groupChat = messageService.createGroupChat(name, members);
        return ResponseEntity.ok(GroupChatMapper.toDto(groupChat));
    }

    @GetMapping("/private")
    public ResponseEntity<List<PrivateChatDto>> getConversations(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        User user = userService.getUserFromToken(jwtToken);
        List<PrivateChatDto> privateChats = messageService.getPrivateChatsForUser(user)
                .stream()
                .map(privateChat -> PrivateChatMapper.toDto(privateChat, user))
                .collect(Collectors.toList());
        return ResponseEntity.ok(privateChats);
    }

    @GetMapping("/group")
    public ResponseEntity<List<GroupChatDto>> getGroupChats(@RequestHeader("Authorization") String token) {
            String jwtToken = token.replace("Bearer ", "");
            User user = userService.getUserFromToken(jwtToken);
            List<GroupChatDto> groupChats = user.getGroupChats()
                    .stream()
                    .map(GroupChatMapper::toDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(groupChats);
    }
}
