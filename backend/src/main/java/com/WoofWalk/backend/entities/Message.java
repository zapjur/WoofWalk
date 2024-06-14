package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderEmail;

    @Column(nullable = false)
    private String receiverEmail;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
