package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class GroupMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String sender;

    @Column(nullable = false)
    private long timestamp;

    @ManyToOne
    @JoinColumn(name = "group_chat_id", nullable = false)
    private GroupChat groupChat;

}
