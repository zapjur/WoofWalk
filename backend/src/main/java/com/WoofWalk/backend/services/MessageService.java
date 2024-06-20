package com.WoofWalk.backend.services;

import com.WoofWalk.backend.entities.GroupChat;
import com.WoofWalk.backend.entities.Message;
import com.WoofWalk.backend.entities.PrivateChat;
import com.WoofWalk.backend.entities.User;
import com.WoofWalk.backend.repositories.GroupChatRepository;
import com.WoofWalk.backend.repositories.MessageRepository;
import com.WoofWalk.backend.repositories.PrivateChatRepository;
import com.WoofWalk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final PrivateChatRepository privateChatRepository;
    private final GroupChatRepository groupChatRepository;
    private final UserRepository userRepository;

    public Message savePrivateMessage(Message message, Long privateChatId) {
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new RuntimeException("Private chat not found"));
        message.setPrivateChat(privateChat);
        return messageRepository.save(message);
    }

    public Message saveGroupMessage(Message message, Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        message.setGroupChat(groupChat);
        return messageRepository.save(message);
    }

    public List<Message> getMessagesInPrivateChat(Long privateChatId) {
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new RuntimeException("Private chat not found"));
        return messageRepository.findByPrivateChat(privateChat);
    }

    public List<Message> getMessagesInGroupChat(Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        return messageRepository.findByGroupChat(groupChat);
    }

    public PrivateChat createPrivateChat(User user1, User user2) {
        Set<User> participants = new HashSet<>();
        participants.add(user1);
        participants.add(user2);

        PrivateChat privateChat = new PrivateChat();
        privateChat.setParticipants(participants);
        return privateChatRepository.save(privateChat);
    }

    public GroupChat createGroupChat(String name, Set<User> members) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(name);
        groupChat.setMembers(members);
        return groupChatRepository.save(groupChat);
    }

    public List<PrivateChat> getPrivateChatsForUser(User user) {
        return privateChatRepository.findByParticipantsContaining(user);
    }
}
