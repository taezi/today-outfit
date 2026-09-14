package com.todayoutfit.backend.recommendation.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RecommendationResponse(
        Long id,
        Long userId,
        String top,
        String bottom,
        String outer,
        String shoes,
        String reason,
        LocalDateTime createdAt,
        List<ShoppingLinkResponse> shoppingLinks
) {
}
