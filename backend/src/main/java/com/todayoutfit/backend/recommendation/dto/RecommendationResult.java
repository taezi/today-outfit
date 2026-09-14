package com.todayoutfit.backend.recommendation.dto;

public record RecommendationResult(
        String top,
        String bottom,
        String outer,
        String shoes,
        String reason
) {
}
