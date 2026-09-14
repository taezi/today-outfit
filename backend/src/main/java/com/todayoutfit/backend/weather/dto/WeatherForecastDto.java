package com.todayoutfit.backend.weather.dto;

public record WeatherForecastDto(
        String time,
        Integer temperature,
        String sky,
        Integer rainProbability,
        Double windSpeed
) {
}
