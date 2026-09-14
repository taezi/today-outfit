package com.todayoutfit.backend.recommendation.dto;

public record ShoppingLinkResponse(
        String part,
        String label,
        String keyword,
        String url
) {
}
