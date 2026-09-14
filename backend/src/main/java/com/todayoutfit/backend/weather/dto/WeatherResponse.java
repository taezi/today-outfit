package com.todayoutfit.backend.weather.dto;

import java.util.List;

public record WeatherResponse(
        String location,
        List<WeatherForecastDto> forecasts
) {
}
