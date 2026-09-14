package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.recommendation.dto.RecommendationResponse;
import com.todayoutfit.backend.recommendation.dto.RecommendationPromptResponse;
import com.todayoutfit.backend.recommendation.dto.RecommendationResult;
import com.todayoutfit.backend.recommendation.entity.Recommendation;
import com.todayoutfit.backend.recommendation.repository.RecommendationRepository;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.user.repository.UserRepository;
import com.todayoutfit.backend.weather.dto.WeatherResponse;
import com.todayoutfit.backend.weather.service.WeatherService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final RecommendationRepository recommendationRepository;
    private final WeatherService weatherService;
    private final RecommendationGenerator recommendationGenerator;
    private final RecommendationPromptBuilder recommendationPromptBuilder;
    private final ShoppingLinkService shoppingLinkService;

    public RecommendationService(
            UserRepository userRepository,
            RecommendationRepository recommendationRepository,
            WeatherService weatherService,
            RecommendationGenerator recommendationGenerator,
            RecommendationPromptBuilder recommendationPromptBuilder,
            ShoppingLinkService shoppingLinkService
    ) {
        this.userRepository = userRepository;
        this.recommendationRepository = recommendationRepository;
        this.weatherService = weatherService;
        this.recommendationGenerator = recommendationGenerator;
        this.recommendationPromptBuilder = recommendationPromptBuilder;
        this.shoppingLinkService = shoppingLinkService;
    }

    @Transactional
    public RecommendationResponse createRecommendation(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        WeatherResponse weather = weatherService.getTodayWeather();
        RecommendationResult result = recommendationGenerator.generate(user, weather);

        Recommendation recommendation = new Recommendation(
                user,
                result.top(),
                result.bottom(),
                result.outer(),
                result.shoes(),
                result.reason()
        );

        Recommendation savedRecommendation = recommendationRepository.save(recommendation);

        return toResponse(savedRecommendation);
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendations(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
        }

        return recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecommendationPromptResponse getRecommendationPrompt(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        WeatherResponse weather = weatherService.getTodayWeather();
        String prompt = recommendationPromptBuilder.build(user, weather);

        return new RecommendationPromptResponse(prompt);
    }

    @Transactional
    public void deleteRecommendation(Long recommendationId) {
        if (!recommendationRepository.existsById(recommendationId)) {
            throw new IllegalArgumentException("추천 기록을 찾을 수 없습니다.");
        }

        recommendationRepository.deleteById(recommendationId);
    }

    private RecommendationResponse toResponse(Recommendation recommendation) {
        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getUser().getId(),
                recommendation.getTop(),
                recommendation.getBottom(),
                recommendation.getOuter(),
                recommendation.getShoes(),
                recommendation.getReason(),
                recommendation.getCreatedAt(),
                shoppingLinkService.createLinks(recommendation)
        );
    }
}
