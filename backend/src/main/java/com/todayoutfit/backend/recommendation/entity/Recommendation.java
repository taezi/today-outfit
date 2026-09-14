package com.todayoutfit.backend.recommendation.entity;

import com.todayoutfit.backend.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String top;

    @Column(nullable = false, length = 100)
    private String bottom;

    @Column(name = "outer_item", nullable = false, length = 100)
    private String outer;

    @Column(nullable = false, length = 100)
    private String shoes;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Recommendation() {
    }

    public Recommendation(
            User user,
            String top,
            String bottom,
            String outer,
            String shoes,
            String reason
    ) {
        this.user = user;
        this.top = top;
        this.bottom = bottom;
        this.outer = outer;
        this.shoes = shoes;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getTop() {
        return top;
    }

    public String getBottom() {
        return bottom;
    }

    public String getOuter() {
        return outer;
    }

    public String getShoes() {
        return shoes;
    }

    public String getReason() {
        return reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
