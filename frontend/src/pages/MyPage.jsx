import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserApi, updateUserApi } from "../api/userApi.js";
import {
  deleteRecommendation,
  fetchRecommendations,
} from "../store/recommendationSlice.js";

const genderLabels = {
  FEMALE: "여성",
  MALE: "남성",
};

const ageGroupLabels = {
  TEENS: "10대",
  TWENTIES: "20대",
  THIRTIES: "30대",
  FORTIES: "40대",
  FIFTIES: "50대 이상",
};

function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const {
    histories,
    loading: recommendationLoading,
    error: recommendationError,
  } = useSelector((state) => state.recommendation);
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openedHistoryId, setOpenedHistoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    alert("로그인이 필요합니다.");
    navigate("/login", { state: { from: location.pathname } });
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setProfile(null);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserApi(user.id);
        setProfile(userProfile);
        setEditForm(toEditForm(userProfile));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      return;
    }

    dispatch(fetchRecommendations(user.id));
  }, [dispatch, isLoggedIn, user?.id]);

  const handleEditClick = () => {
    setEditForm(toEditForm(profile));
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditForm(toEditForm(profile));
    setIsEditing(false);
    setError(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updateData = {
      ...editForm,
      coldSensitivity: Number(editForm.coldSensitivity),
      heatSensitivity: Number(editForm.heatSensitivity),
    };

    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await updateUserApi(user.id, updateData);
      setProfile(updatedProfile);
      setEditForm(toEditForm(updatedProfile));
      setIsEditing(false);
      alert("회원정보가 수정되었습니다.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHistory = (historyId) => {
    setOpenedHistoryId((prev) => (prev === historyId ? null : historyId));
  };

  const handleDeleteHistory = async (historyId) => {
    if (!confirm("이 추천 기록을 삭제할까요?")) {
      return;
    }

    const result = await dispatch(deleteRecommendation(historyId));

    if (deleteRecommendation.fulfilled.match(result)) {
      alert("추천 기록이 삭제되었습니다.");
      setOpenedHistoryId((prev) => (prev === historyId ? null : prev));
    }
  };

  return (
    <section className="page-section">
      <h1>마이페이지</h1>
      <div className="panel">
        {isLoggedIn && loading && <p>회원정보를 불러오는 중입니다.</p>}
        {isLoggedIn && error && <p className="error-text">{error}</p>}
        {isLoggedIn && profile && !isEditing && (
          <dl className="profile-list">
            <div>
              <dt>이메일</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>닉네임</dt>
              <dd>{profile.nickname}</dd>
            </div>
            <div>
              <dt>성별</dt>
              <dd>{genderLabels[profile.gender] ?? profile.gender}</dd>
            </div>
            <div>
              <dt>연령대</dt>
              <dd>{ageGroupLabels[profile.ageGroup] ?? profile.ageGroup}</dd>
            </div>
            <div>
              <dt>선호 스타일</dt>
              <dd>{profile.preferredStyle}</dd>
            </div>
            <div>
              <dt>추위 민감도</dt>
              <dd>{profile.coldSensitivity}</dd>
            </div>
            <div>
              <dt>더위 민감도</dt>
              <dd>{profile.heatSensitivity}</dd>
            </div>
            <div>
              <dt></dt>
              <dd>
                <button className="secondary-button" type="button" onClick={handleEditClick}>
                  회원정보 수정
                </button>
              </dd>
            </div>
          </dl>
        )}
        {isLoggedIn && profile && isEditing && editForm && (
          <form className="form-panel embedded-form" onSubmit={handleSubmit}>
            <label>
              이메일
              <input value={profile.email} disabled />
            </label>

            <label>
              닉네임
              <input
                name="nickname"
                value={editForm.nickname}
                onChange={handleChange}
                minLength={2}
                maxLength={30}
                required
              />
            </label>

            <label>
              성별
              <select name="gender" value={editForm.gender} onChange={handleChange}>
                <option value="FEMALE">여성</option>
                <option value="MALE">남성</option>
              </select>
            </label>

            <label>
              연령대
              <select name="ageGroup" value={editForm.ageGroup} onChange={handleChange}>
                <option value="TEENS">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES">40대</option>
                <option value="FIFTIES">50대 이상</option>
              </select>
            </label>

            <label>
              선호 스타일
              <input
                name="preferredStyle"
                value={editForm.preferredStyle}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </label>

            <label>
              추위 민감도
              <select
                name="coldSensitivity"
                value={editForm.coldSensitivity}
                onChange={handleChange}
              >
                <option value="1">1 - 추위를 거의 안 탐</option>
                <option value="2">2</option>
                <option value="3">3 - 보통</option>
                <option value="4">4</option>
                <option value="5">5 - 추위를 많이 탐</option>
              </select>
            </label>

            <label>
              더위 민감도
              <select
                name="heatSensitivity"
                value={editForm.heatSensitivity}
                onChange={handleChange}
              >
                <option value="1">1 - 더위를 거의 안 탐</option>
                <option value="2">2</option>
                <option value="3">3 - 보통</option>
                <option value="4">4</option>
                <option value="5">5 - 더위를 많이 탐</option>
              </select>
            </label>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "저장 중" : "저장"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancelClick}
                disabled={saving}
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>
      {isLoggedIn && (
        <div className="panel">
          <h2>이전 착장 추천 기록</h2>
          {recommendationLoading && <p>추천 기록을 불러오는 중입니다.</p>}
          {recommendationError && <p className="error-text">{recommendationError}</p>}
          {!recommendationLoading && histories.length === 0 && (
            <p>아직 저장된 추천 기록이 없습니다.</p>
          )}
          {histories.length > 0 && (
            <div className="history-list">
              {histories.map((history) => {
                const isOpen = openedHistoryId === history.id;

                return (
                  <article className="history-item" key={history.id}>
                    <div className="history-summary">
                      <div>
                        <time>{formatDateTime(history.createdAt)}</time>
                        <p>{history.top} / {history.bottom} / {history.outer}</p>
                      </div>
                      <div className="history-actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() => handleToggleHistory(history.id)}
                        >
                          {isOpen ? "닫기" : "자세히 보기"}
                        </button>
                        <button
                          className="danger-button"
                          type="button"
                          onClick={() => handleDeleteHistory(history.id)}
                          disabled={recommendationLoading}
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="history-detail">
                        <div className="outfit-grid">
                          <div>
                            <strong>상의</strong>
                            <span>{history.top}</span>
                          </div>
                          <div>
                            <strong>하의</strong>
                            <span>{history.bottom}</span>
                          </div>
                          <div>
                            <strong>아우터</strong>
                            <span>{history.outer}</span>
                          </div>
                          <div>
                            <strong>신발</strong>
                            <span>{history.shoes}</span>
                          </div>
                        </div>
                        <div className="recommendation-reason">
                          <strong>추천 이유</strong>
                          <p>{history.reason}</p>
                        </div>
                        {history.shoppingLinks?.length > 0 && (
                          <div className="shopping-link-list">
                            <strong>무신사 검색 링크</strong>
                            <div>
                              {history.shoppingLinks.map((link) => (
                                <a
                                  href={link.url}
                                  key={`${history.id}-${link.part}-${link.keyword}`}
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
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function toEditForm(profile) {
  return {
    nickname: profile.nickname,
    gender: profile.gender,
    ageGroup: profile.ageGroup,
    preferredStyle: profile.preferredStyle,
    coldSensitivity: profile.coldSensitivity,
    heatSensitivity: profile.heatSensitivity,
  };
}

function formatDateTime(value) {
  if (!value) {
    return "날짜 정보 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default MyPage;
