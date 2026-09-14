package com.todayoutfit.backend.weather.controller;

import com.todayoutfit.backend.weather.dto.WeatherResponse;
import com.todayoutfit.backend.weather.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/today")
    public WeatherResponse getTodayWeather() {
        return weatherService.getTodayWeather();
    }
}
