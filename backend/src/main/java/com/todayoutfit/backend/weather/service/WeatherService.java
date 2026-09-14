package com.todayoutfit.backend.weather.service;

import com.todayoutfit.backend.weather.config.WeatherProperties;
import com.todayoutfit.backend.weather.dto.WeatherForecastDto;
import com.todayoutfit.backend.weather.dto.WeatherResponse;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final List<String> TARGET_TIMES = List.of("0800", "1400", "1700");

    private final RestClient restClient;
    private final WeatherProperties weatherProperties;

    public WeatherService(WeatherProperties weatherProperties) {
        this.weatherProperties = weatherProperties;
        this.restClient = RestClient.builder()
                .baseUrl(weatherProperties.getBaseUrl())
                .build();
    }

    public WeatherResponse getTodayWeather() {
        if (!StringUtils.hasText(weatherProperties.getServiceKey())) {
            throw new IllegalStateException("KMA_SERVICE_KEY 환경변수가 설정되어 있지 않습니다.");
        }

        BaseDateTime baseDateTime = calculateBaseDateTime();
        JsonNode response = requestVilageForecast(baseDateTime);
        Map<String, Map<String, String>> forecastsByTime = groupForecastsByTime(response);

        List<WeatherForecastDto> forecasts = TARGET_TIMES.stream()
                .map(time -> toForecastDto(time, forecastsByTime.getOrDefault(time, Map.of())))
                .toList();

        return new WeatherResponse(weatherProperties.getLocationName(), forecasts);
    }

    private JsonNode requestVilageForecast(BaseDateTime baseDateTime) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/getVilageFcst")
                        .queryParam("serviceKey", weatherProperties.getServiceKey())
                        .queryParam("pageNo", 1)
                        .queryParam("numOfRows", 1000)
                        .queryParam("dataType", "JSON")
                        .queryParam("base_date", baseDateTime.date())
                        .queryParam("base_time", baseDateTime.time())
                        .queryParam("nx", weatherProperties.getNx())
                        .queryParam("ny", weatherProperties.getNy())
                        .build())
                .retrieve()
                .body(JsonNode.class);
    }

    private Map<String, Map<String, String>> groupForecastsByTime(JsonNode response) {
        JsonNode items = response.path("response").path("body").path("items").path("item");
        Map<String, Map<String, String>> forecastsByTime = new HashMap<>();

        if (!items.isArray()) {
            return forecastsByTime;
        }

        for (JsonNode item : items) {
            String fcstTime = item.path("fcstTime").asText();

            if (!TARGET_TIMES.contains(fcstTime)) {
                continue;
            }

            String category = item.path("category").asText();
            String value = item.path("fcstValue").asText();

            forecastsByTime
                    .computeIfAbsent(fcstTime, ignored -> new HashMap<>())
                    .put(category, value);
        }

        return forecastsByTime;
    }

    private WeatherForecastDto toForecastDto(String time, Map<String, String> values) {
        return new WeatherForecastDto(
                formatForecastTime(time),
                parseInteger(values.get("TMP")),
                convertWeatherText(values.get("SKY"), values.get("PTY")),
                parseInteger(values.get("POP")),
                parseDouble(values.get("WSD"))
        );
    }

    private BaseDateTime calculateBaseDateTime() {
        LocalDateTime now = LocalDateTime.now(KOREA_ZONE).minusMinutes(10);
        LocalDate baseDate = now.toLocalDate();
        LocalTime nowTime = now.toLocalTime();

        List<LocalTime> baseTimes = new ArrayList<>(List.of(
                LocalTime.of(2, 0),
                LocalTime.of(5, 0),
                LocalTime.of(8, 0),
                LocalTime.of(11, 0),
                LocalTime.of(14, 0),
                LocalTime.of(17, 0),
                LocalTime.of(20, 0),
                LocalTime.of(23, 0)
        ));

        LocalTime selectedBaseTime = LocalTime.of(23, 0);
        if (nowTime.isBefore(baseTimes.getFirst())) {
            baseDate = baseDate.minusDays(1);
        } else {
            for (LocalTime baseTime : baseTimes) {
                if (!nowTime.isBefore(baseTime)) {
                    selectedBaseTime = baseTime;
                }
            }
        }

        return new BaseDateTime(
                baseDate.format(DATE_FORMATTER),
                selectedBaseTime.format(DateTimeFormatter.ofPattern("HHmm"))
        );
    }

    private String convertWeatherText(String skyCode, String precipitationTypeCode) {
        return switch (precipitationTypeCode == null ? "0" : precipitationTypeCode) {
            case "1" -> "비";
            case "2" -> "비/눈";
            case "3" -> "눈";
            case "4" -> "소나기";
            default -> convertSkyText(skyCode);
        };
    }

    private String convertSkyText(String skyCode) {
        return switch (skyCode == null ? "" : skyCode) {
            case "1" -> "맑음";
            case "3" -> "구름많음";
            case "4" -> "흐림";
            default -> "정보없음";
        };
    }

    private String formatForecastTime(String time) {
        return time.substring(0, 2) + ":" + time.substring(2);
    }

    private Integer parseInteger(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return Integer.valueOf(value);
    }

    private Double parseDouble(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return Double.valueOf(value);
    }

    private record BaseDateTime(String date, String time) {
    }
}
