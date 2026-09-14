import { useState } from "react";
import {
  LockKeyhole,
  Mail,
  Settings,
  Shirt,
  SlidersHorizontal,
  Thermometer,
  User,
  UserPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../store/authSlice.js";

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "FEMALE",
    ageGroup: "TWENTIES",
    preferredStyle: "",
    coldSensitivity: 3,
    heatSensitivity: 3,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const signupData = {
      ...form,
      coldSensitivity: Number(form.coldSensitivity),
      heatSensitivity: Number(form.heatSensitivity),
    };

    const result = await dispatch(signup(signupData));

    if (signup.fulfilled.match(result)) {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    }
  };

  return (
    <section className="page-section signup-page">
      <div className="signup-heading">
        <span className="eyebrow">
          <UserPlus size={15} />
          Join today
        </span>
        <h1>회원가입</h1>
        <p className="page-description">
          기본 정보와 스타일 취향을 입력하면 날씨에 맞춘 착장 추천을 받을 수 있습니다.
        </p>
      </div>

      <form className="form-panel signup-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            <User size={18} />
            기본정보
          </legend>
          <div className="form-grid">
            <label>
              이메일
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </label>

            <label>
              비밀번호
              <div className="input-with-icon">
                <LockKeyhole size={18} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={30}
                  placeholder="8자 이상"
                  required
                />
              </div>
            </label>

            <label>
              닉네임
              <div className="input-with-icon">
                <User size={18} />
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={30}
                  placeholder="닉네임"
                  required
                />
              </div>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <Shirt size={18} />
            스타일 정보
          </legend>
          <div className="form-grid">
            <label>
              성별
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="FEMALE">여성</option>
                <option value="MALE">남성</option>
              </select>
            </label>

            <label>
              연령대
              <select name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                <option value="TEENS">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES">40대</option>
                <option value="FIFTIES">50대 이상</option>
              </select>
            </label>

            <label className="wide-field">
              선호 스타일
              <div className="input-with-icon">
                <Settings size={18} />
                <input
                  name="preferredStyle"
                  value={form.preferredStyle}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="예: 캐주얼, 스트릿, 미니멀"
                  required
                />
              </div>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <SlidersHorizontal size={18} />
            민감도 정보
          </legend>
          <div className="form-grid">
            <label>
              추위 민감도
              <select
                name="coldSensitivity"
                value={form.coldSensitivity}
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
                value={form.heatSensitivity}
                onChange={handleChange}
              >
                <option value="1">1 - 더위를 거의 안 탐</option>
                <option value="2">2</option>
                <option value="3">3 - 보통</option>
                <option value="4">4</option>
                <option value="5">5 - 더위를 많이 탐</option>
              </select>
            </label>
          </div>
          <p className="field-hint">
            <Thermometer size={15} />
            민감도는 추천 결과에서 아우터와 소재를 고를 때 사용됩니다.
          </p>
        </fieldset>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          <UserPlus size={17} />
          {loading ? "가입 중" : "회원가입"}
        </button>
      </form>
    </section>
  );
}

export default SignupPage;
