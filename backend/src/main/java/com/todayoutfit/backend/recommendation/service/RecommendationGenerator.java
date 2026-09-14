package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.recommendation.dto.RecommendationResult;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.weather.dto.WeatherResponse;

public interface RecommendationGenerator {

    RecommendationResult generate(User user, WeatherResponse weather);
}
