package com.todayoutfit.backend.user.dto;

import com.todayoutfit.backend.user.entity.AgeGroup;
import com.todayoutfit.backend.user.entity.Gender;

public record UserResponse(
        Long id,
        String email,
        String nickname,
        Gender gender,
        AgeGroup ageGroup,
        String preferredStyle,
        Integer coldSensitivity,
        Integer heatSensitivity
) {
}
