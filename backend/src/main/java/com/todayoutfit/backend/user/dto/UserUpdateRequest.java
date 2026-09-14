package com.todayoutfit.backend.user.dto;

import com.todayoutfit.backend.user.entity.AgeGroup;
import com.todayoutfit.backend.user.entity.Gender;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @NotBlank
        @Size(min = 2, max = 30)
        String nickname,

        @NotNull
        Gender gender,

        @NotNull
        AgeGroup ageGroup,

        @NotBlank
        @Size(max = 100)
        String preferredStyle,

        @NotNull
        @Min(1)
        @Max(5)
        Integer coldSensitivity,

        @NotNull
        @Min(1)
        @Max(5)
        Integer heatSensitivity
) {
}
