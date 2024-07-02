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
public class GroupChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "group_chat_members",
            joinColumns = @JoinColumn(name = "group_chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "groupChat")
    private Set<GroupMessage> messages = new HashSet<>();
}
