package com.WoofWalk.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Setter
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String sub;

    @Column
    private String phoneNumber;

    @Column
    private String address;

    @Column
    private String profilePictureId;

    @OneToMany(mappedBy = "user")
    private List<Rating> ratings;

    @ManyToMany
    @JoinTable(
            name = "user_friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    private Set<User> friends;

    @OneToMany(mappedBy = "user")
    private List<Dog> dogs;

    @ManyToMany
    @JoinTable(
            name = "user_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private Set<Event> events;

    @ManyToMany(mappedBy = "participants")
    private Set<PrivateChat> privateChats = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    private Set<GroupChat> groupChats = new HashSet<>();

}
