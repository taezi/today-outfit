package com.todayoutfit.backend.auth.dto;

import com.todayoutfit.backend.user.entity.AgeGroup;
import com.todayoutfit.backend.user.entity.Gender;

public record SignupResponse(
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
