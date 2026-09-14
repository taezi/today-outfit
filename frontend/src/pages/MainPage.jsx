import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRecommendation,
  fetchRecommendationPrompt,
} from "../store/recommendationSlice.js";
import { fetchTodayWeather } from "../store/weatherSlice.js";

function MainPage() {
  const dispatch = useDispatch();
  const { data: weather, loading, error } = useSelector((state) => state.weather);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const {
    current: recommendation,
    prompt,
    loading: recommendationLoading,
    error: recommendationError,
  } = useSelector((state) => state.recommendation);

  useEffect(() => {
    dispatch(fetchTodayWeather());
  }, [dispatch]);

  const handleCreateRecommendation = () => {
    dispatch(createRecommendation(user.id));
  };

  const handleShowPrompt = () => {
    dispatch(fetchRecommendationPrompt(user.id));
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    alert("프롬프트를 복사했습니다.");
  };

  return (
    <section className="page-section">
      <h1>오늘의 착장</h1>
      <p className="page-description">
        날씨와 취향을 바탕으로 오늘 입기 좋은 스타일을 추천합니다.
      </p>

      <div className="panel">
        <h2>오늘의 날씨</h2>
        {loading && <p>날씨를 불러오는 중입니다.</p>}
        {error && <p className="error-text">{error}</p>}
        {weather && (
          <div className="weather-grid">
            {weather.forecasts.map((forecast) => (
              <div className="weather-item" key={forecast.time}>
                <strong>{forecast.time}</strong>
                <span>{forecast.temperature}도</span>
                <span>{forecast.sky}</span>
                <span>강수 {forecast.rainProbability}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        {isLoggedIn ? (
          <div className="recommendation-section">
            <div>
              <h2>오늘의 착장 추천</h2>
              <p className="panel-description">
                {user.nickname}님의 회원정보와 오늘 날씨를 바탕으로 착장 추천 흐름을 실험합니다.
              </p>
            </div>

            <div className="button-row">
              <button
                className="primary-button"
                type="button"
                onClick={handleCreateRecommendation}
                disabled={recommendationLoading}
              >
                {recommendationLoading ? "처리 중" : "임시 추천받기"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={handleShowPrompt}
                disabled={recommendationLoading}
              >
                AI 프롬프트 보기
              </button>
            </div>

            {recommendationError && <p className="error-text">{recommendationError}</p>}

            {prompt && (
              <div className="prompt-box">
                <div className="prompt-header">
                  <strong>Codex에 보낼 프롬프트</strong>
                  <button className="secondary-button" type="button" onClick={handleCopyPrompt}>
                    복사
                  </button>
                </div>
                <textarea value={prompt} readOnly />
              </div>
            )}

            {recommendation && (
              <div className="recommendation-result">
                <div className="outfit-grid">
                  <div>
                    <strong>상의</strong>
                    <span>{recommendation.top}</span>
                  </div>
                  <div>
                    <strong>하의</strong>
                    <span>{recommendation.bottom}</span>
                  </div>
                  <div>
                    <strong>아우터</strong>
                    <span>{recommendation.outer}</span>
                  </div>
                  <div>
                    <strong>신발</strong>
                    <span>{recommendation.shoes}</span>
                  </div>
                </div>

                <div className="recommendation-reason">
                  <strong>추천 이유</strong>
                  <p>{recommendation.reason}</p>
                </div>

                {recommendation.shoppingLinks?.length > 0 && (
                  <div className="shopping-link-list">
                    <strong>무신사 검색 링크</strong>
                    <div>
                      {recommendation.shoppingLinks.map((link) => (
                        <a
                          href={link.url}
                          key={`${link.part}-${link.keyword}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>로그인하면 사용자 정보와 날씨를 바탕으로 착장을 추천받을 수 있습니다.</p>
        )}
      </div>
    </section>
  );
}

export default MainPage;
