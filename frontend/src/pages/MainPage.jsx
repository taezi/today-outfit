import { useEffect } from "react";
import {
  Bot,
  Cloud,
  CloudRain,
  CloudSun,
  Clock,
  Copy,
  LogIn,
  MapPin,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
    <section className="page-section main-page">
      <div className="main-hero">
        <div>
          <span className="eyebrow">
            <MapPin size={15} />
            서울 종로구
          </span>
          <h1>오늘의 착장</h1>
          <p className="page-description">
            오늘 날씨와 내 취향을 함께 보고 입기 좋은 조합을 추천합니다.
          </p>
        </div>
        <div className="hero-weather-badge">
          <CloudSun size={28} />
          <span>Weather based outfit</span>
        </div>
      </div>

      <div className="panel weather-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <CloudSun size={15} />
              Today weather
            </span>
            <h2>서울 종로구 오늘의 날씨</h2>
          </div>
          <span className="section-caption">08시 / 14시 / 17시</span>
        </div>
        {loading && <p>날씨를 불러오는 중입니다.</p>}
        {error && <p className="error-text">{error}</p>}
        {weather && (
          <div className="weather-grid">
            {weather.forecasts.map((forecast) => (
              <div className="weather-item" key={forecast.time}>
                <div className="weather-card-top">
                  <span className="weather-icon">{getWeatherIcon(forecast.sky)}</span>
                  <span className="weather-time">
                    <Clock size={14} />
                    {forecast.time}
                  </span>
                </div>
                <strong>{forecast.temperature}도</strong>
                <span className="weather-sky">{forecast.sky}</span>
                <div className="weather-meta">
                  <span>
                    <Umbrella size={14} />
                    강수 {forecast.rainProbability}%
                  </span>
                  <span>
                    <Wind size={14} />
                    바람 {forecast.windSpeed}m/s
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel recommendation-panel">
        {isLoggedIn ? (
          <div className="recommendation-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <Sparkles size={15} />
                  AI outfit
                </span>
                <h2>오늘의 AI 착장 추천</h2>
              </div>
              <p className="panel-description">
                {user.nickname}님의 회원정보와 오늘 날씨를 바탕으로 추천합니다.
              </p>
            </div>

            <div className="button-row">
              <button
                className="primary-button"
                type="button"
                onClick={handleCreateRecommendation}
                disabled={recommendationLoading}
              >
                <Shirt size={16} />
                {recommendationLoading ? "처리 중" : "오늘 착장 추천받기"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={handleShowPrompt}
                disabled={recommendationLoading}
              >
                <Bot size={16} />
                AI 프롬프트 보기
              </button>
            </div>

            {recommendationError && <p className="error-text">{recommendationError}</p>}

            {recommendationLoading && (
              <div className="loading-panel">
                <Sparkles size={18} />
                <strong>AI가 오늘의 착장을 고르는 중입니다.</strong>
                <p>Codex CLI를 호출하고 있어서 몇 초 정도 걸릴 수 있습니다.</p>
              </div>
            )}

            {prompt && (
              <div className="prompt-box">
                <div className="prompt-header">
                  <strong>Codex에 보낼 프롬프트</strong>
                  <button className="secondary-button" type="button" onClick={handleCopyPrompt}>
                    <Copy size={16} />
                    복사
                  </button>
                </div>
                <textarea value={prompt} readOnly />
              </div>
            )}

            {recommendation && (
              <div className="recommendation-result">
                <div className="outfit-preview">
                  <div className="outfit-preview-icon">
                    <Shirt size={40} />
                  </div>
                  <div>
                    <strong>추천 착장 프리뷰</strong>
                    <p>이미지 영역은 나중에 착장 이미지나 상품 이미지가 들어갈 자리입니다.</p>
                  </div>
                </div>
                <div className="outfit-grid">
                  <div className="outfit-card">
                    <strong>상의</strong>
                    <span>{recommendation.top}</span>
                  </div>
                  <div className="outfit-card">
                    <strong>하의</strong>
                    <span>{recommendation.bottom}</span>
                  </div>
                  <div className="outfit-card">
                    <strong>아우터</strong>
                    <span>{recommendation.outer}</span>
                  </div>
                  <div className="outfit-card">
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
                    <strong>
                      <ShoppingBag size={16} />
                      무신사 검색 링크
                    </strong>
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
          <div className="login-cta">
            <div>
              <span className="eyebrow">
                <Sparkles size={15} />
                Personalized
              </span>
              <h2>로그인하면 맞춤 착장을 추천해드려요</h2>
              <p>
                성별, 연령대, 선호 스타일, 추위/더위 민감도를 반영해 오늘 입기 좋은 조합을 만들 수 있습니다.
              </p>
            </div>
            <Link className="primary-button" to="/login">
              <LogIn size={16} />
              로그인하고 추천받기
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function getWeatherIcon(sky) {
  if (sky?.includes("비")) {
    return <CloudRain size={24} />;
  }

  if (sky?.includes("구름")) {
    return <CloudSun size={24} />;
  }

  if (sky?.includes("흐림")) {
    return <Cloud size={24} />;
  }

  return <Sun size={24} />;
}

export default MainPage;
