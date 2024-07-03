package com.WoofWalk.backend.services;

import com.WoofWalk.backend.dto.GroupMessageDto;
import com.WoofWalk.backend.entities.*;
import com.WoofWalk.backend.mappers.MessageMapper;
import com.WoofWalk.backend.repositories.GroupChatRepository;
import com.WoofWalk.backend.repositories.GroupMessageRepository;
import com.WoofWalk.backend.repositories.MessageRepository;
import com.WoofWalk.backend.repositories.PrivateChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.secretsmanager.endpoints.internal.Value;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final PrivateChatRepository privateChatRepository;
    private final GroupChatRepository groupChatRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final S3Service s3Service;

    public Message savePrivateMessage(Message message, Long privateChatId) {
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new RuntimeException("Private chat not found"));
        message.setPrivateChat(privateChat);
        return messageRepository.save(message);
    }

    public GroupMessage saveGroupMessage(GroupMessageDto message, Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        GroupMessage groupMessage = MessageMapper.groupMessageDtoToEntity(message);
        groupMessage.setGroupChat(groupChat);
        return groupMessageRepository.save(groupMessage);
    }

    public List<Message> getMessagesInPrivateChat(Long privateChatId) {
        PrivateChat privateChat = privateChatRepository.findById(privateChatId)
                .orElseThrow(() -> new RuntimeException("Private chat not found"));
        return messageRepository.findByPrivateChat(privateChat);
    }

    public List<GroupMessage> getMessagesInGroupChat(Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        return groupMessageRepository.findByGroupChat(groupChat);
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

    public Map<String, String> getGroupChatUserSubs(Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        return groupChat.getMembers().stream()
                .collect(Collectors.toMap(User::getSub, User::getEmail));
    }

    public Map<String, String> getGroupChatProfilePictures(Long groupChatId) {
        GroupChat groupChat = groupChatRepository.findById(groupChatId)
                .orElseThrow(() -> new RuntimeException("Group chat not found"));
        return groupChat.getMembers().stream()
                .filter(user -> user.getProfilePictureId() != null && !user.getProfilePictureId().isEmpty())
                .collect(Collectors.toMap(
                        User::getSub,
                        user -> s3Service.getFileUrl(user.getProfilePictureId())
                ));
    }
}
