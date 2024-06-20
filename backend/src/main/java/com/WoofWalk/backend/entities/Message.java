package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String sender;
    @Column(nullable = false)
    private String recipient;
    @Column(nullable = false)
    private String content;
    @Column(nullable = false)
    private long timestamp;

    @ManyToOne
    @JoinColumn(name = "private_chat_id")
    private PrivateChat privateChat;

    @ManyToOne
    @JoinColumn(name = "group_chat_id")
    private GroupChat groupChat;

}
