package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "invitations")
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender", nullable = false)
    private String senderEmail;

    @Column(name = "receiver", nullable = false)
    private String receiverEmail;

    @Column(name = "status", nullable = false)
    private String status;
}
