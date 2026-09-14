package com.todayoutfit.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 30)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AgeGroup ageGroup;

    @Column(nullable = false, length = 100)
    private String preferredStyle;

    @Column(nullable = false)
    private Integer coldSensitivity;

    @Column(nullable = false)
    private Integer heatSensitivity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected User() {
    }

    public User(
            String email,
            String password,
            String nickname,
            Gender gender,
            AgeGroup ageGroup,
            String preferredStyle,
            Integer coldSensitivity,
            Integer heatSensitivity
    ) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.gender = gender;
        this.ageGroup = ageGroup;
        this.preferredStyle = preferredStyle;
        this.coldSensitivity = coldSensitivity;
        this.heatSensitivity = heatSensitivity;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getNickname() {
        return nickname;
    }

    public Gender getGender() {
        return gender;
    }

    public AgeGroup getAgeGroup() {
        return ageGroup;
    }

    public String getPreferredStyle() {
        return preferredStyle;
    }

    public Integer getColdSensitivity() {
        return coldSensitivity;
    }

    public Integer getHeatSensitivity() {
        return heatSensitivity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void updateProfile(
            String nickname,
            Gender gender,
            AgeGroup ageGroup,
            String preferredStyle,
            Integer coldSensitivity,
            Integer heatSensitivity
    ) {
        this.nickname = nickname;
        this.gender = gender;
        this.ageGroup = ageGroup;
        this.preferredStyle = preferredStyle;
        this.coldSensitivity = coldSensitivity;
        this.heatSensitivity = heatSensitivity;
    }
}
