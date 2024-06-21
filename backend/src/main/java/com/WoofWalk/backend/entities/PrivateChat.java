package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Getter
@Setter
public class PrivateChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "private_chat_participants",
            joinColumns = @JoinColumn(name = "private_chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> participants = new HashSet<>();

    @OneToMany(mappedBy = "privateChat")
    private Set<Message> messages = new HashSet<>();
}
