package com.todayoutfit.backend.recommendation.controller;

import com.todayoutfit.backend.recommendation.dto.RecommendationPromptResponse;
import com.todayoutfit.backend.recommendation.dto.RecommendationResponse;
import com.todayoutfit.backend.recommendation.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/users/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public RecommendationResponse createRecommendation(@PathVariable Long userId) {
        return recommendationService.createRecommendation(userId);
    }

    @GetMapping("/users/{userId}")
    public List<RecommendationResponse> getRecommendations(@PathVariable Long userId) {
        return recommendationService.getRecommendations(userId);
    }

    @GetMapping("/users/{userId}/prompt")
    public RecommendationPromptResponse getRecommendationPrompt(@PathVariable Long userId) {
        return recommendationService.getRecommendationPrompt(userId);
    }

    @DeleteMapping("/{recommendationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecommendation(@PathVariable Long recommendationId) {
        recommendationService.deleteRecommendation(recommendationId);
    }
}
