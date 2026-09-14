package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.recommendation.dto.RecommendationResult;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.weather.dto.WeatherForecastDto;
import com.todayoutfit.backend.weather.dto.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "recommendation.mode", havingValue = "temporary", matchIfMissing = true)
public class TemporaryRecommendationGenerator implements RecommendationGenerator {

    private static final Logger log = LoggerFactory.getLogger(TemporaryRecommendationGenerator.class);

    private final RecommendationPromptBuilder promptBuilder;

    public TemporaryRecommendationGenerator(RecommendationPromptBuilder promptBuilder) {
        this.promptBuilder = promptBuilder;
    }

    @Override
    public RecommendationResult generate(User user, WeatherResponse weather) {
        String prompt = promptBuilder.build(user, weather);
        log.info("Generated outfit recommendation prompt:\n{}", prompt);

        WeatherForecastDto afternoonWeather = weather.forecasts().stream()
                .filter(forecast -> "14:00".equals(forecast.time()))
                .findFirst()
                .orElse(weather.forecasts().getFirst());

        Integer temperature = afternoonWeather.temperature();
        String outer = temperature != null && temperature < 22 ? "가벼운 자켓" : "얇은 셔츠";

        return new RecommendationResult(
                "기본 티셔츠",
                "데님 팬츠",
                outer,
                "스니커즈",
                user.getPreferredStyle() + " 스타일을 기준으로, " + afternoonWeather.time()
                        + " 날씨가 " + afternoonWeather.sky()
                        + "이고 기온이 " + temperature + "도라서 활동하기 편한 착장을 추천합니다."
        );
    }
}
