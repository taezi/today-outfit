package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.weather.dto.WeatherForecastDto;
import com.todayoutfit.backend.weather.dto.WeatherResponse;
import org.springframework.stereotype.Component;

@Component
public class RecommendationPromptBuilder {

    public String build(User user, WeatherResponse weather) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("다음 사용자 정보와 날씨 정보를 바탕으로 오늘의 착장을 추천해줘.\n\n");

        prompt.append("[사용자 정보]\n");
        prompt.append("성별: ").append(user.getGender()).append("\n");
        prompt.append("연령대: ").append(user.getAgeGroup()).append("\n");
        prompt.append("선호 스타일: ").append(user.getPreferredStyle()).append("\n");
        prompt.append("추위 민감도: ").append(user.getColdSensitivity()).append(" / 5\n");
        prompt.append("더위 민감도: ").append(user.getHeatSensitivity()).append(" / 5\n\n");

        prompt.append("[날씨 정보]\n");
        prompt.append("지역: ").append(weather.location()).append("\n");
        for (WeatherForecastDto forecast : weather.forecasts()) {
            prompt.append("- ")
                    .append(forecast.time())
                    .append(": 기온 ")
                    .append(formatValue(forecast.temperature(), "도"))
                    .append(", 하늘 ")
                    .append(forecast.sky())
                    .append(", 강수확률 ")
                    .append(formatValue(forecast.rainProbability(), "%"))
                    .append(", 풍속 ")
                    .append(formatValue(forecast.windSpeed(), "m/s"))
                    .append("\n");
        }

        prompt.append("\n[응답 규칙]\n");
        prompt.append("응답은 반드시 아래 JSON 형식으로만 작성해줘.\n");
        prompt.append("설명 문장이나 코드블록 없이 JSON만 반환해줘.\n\n");
        prompt.append("[추천 규칙]\n");
        prompt.append("- top, bottom, outer, shoes에는 각각 가장 적합한 아이템 하나만 작성해줘.\n");
        prompt.append("- \"또는\", \"혹은\", \"/\", 쉼표를 사용해서 여러 후보를 나열하지 마.\n");
        prompt.append("- 애매한 표현 대신 실제 쇼핑 검색에 쓸 수 있는 짧고 구체적인 아이템명으로 작성해줘.\n");
        prompt.append("- reason에는 왜 그 하나의 조합을 골랐는지 설명해줘.\n\n");
        prompt.append("{\n");
        prompt.append("  \"top\": \"상의\",\n");
        prompt.append("  \"bottom\": \"하의\",\n");
        prompt.append("  \"outer\": \"아우터\",\n");
        prompt.append("  \"shoes\": \"신발\",\n");
        prompt.append("  \"reason\": \"추천 이유\"\n");
        prompt.append("}");

        return prompt.toString();
    }

    private String formatValue(Integer value, String unit) {
        if (value == null) {
            return "정보없음";
        }
        return value + unit;
    }

    private String formatValue(Double value, String unit) {
        if (value == null) {
            return "정보없음";
        }
        return value + unit;
    }
}
