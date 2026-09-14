package com.todayoutfit.backend.recommendation.service;

import com.todayoutfit.backend.recommendation.dto.ShoppingLinkResponse;
import com.todayoutfit.backend.recommendation.entity.Recommendation;
import com.todayoutfit.backend.user.entity.Gender;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ShoppingLinkService {

    private static final String MUSINSA_SEARCH_URL = "https://www.musinsa.com/search/musinsa/integration?q=";

    public List<ShoppingLinkResponse> createLinks(Recommendation recommendation) {
        String preferredStyle = recommendation.getUser().getPreferredStyle();
        String genderKeyword = toGenderKeyword(recommendation.getUser().getGender());

        return List.of(
                createLink("top", "상의 비슷한 상품 보기", recommendation.getTop(), preferredStyle, genderKeyword),
                createLink("bottom", "하의 비슷한 상품 보기", recommendation.getBottom(), preferredStyle, genderKeyword),
                createLink("outer", "아우터 비슷한 상품 보기", recommendation.getOuter(), preferredStyle, genderKeyword),
                createLink("shoes", "신발 비슷한 상품 보기", recommendation.getShoes(), preferredStyle, genderKeyword)
        );
    }

    private ShoppingLinkResponse createLink(
            String part,
            String label,
            String itemName,
            String preferredStyle,
            String genderKeyword
    ) {
        String keyword = genderKeyword + " " + itemName + " " + preferredStyle;
        String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);

        return new ShoppingLinkResponse(
                part,
                label,
                keyword,
                MUSINSA_SEARCH_URL + encodedKeyword
        );
    }

    private String toGenderKeyword(Gender gender) {
        if (gender == Gender.MALE) {
            return "남성";
        }

        return "여성";
    }
}
