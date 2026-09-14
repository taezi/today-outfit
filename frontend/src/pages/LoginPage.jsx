import { useState } from "react";
import { CloudSun, LockKeyhole, LogIn, Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";

function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const redirectPath = location.state?.from ?? "/";
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      alert("로그인하였습니다.");
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <span className="auth-icon">
            <CloudSun size={28} />
          </span>
          <span className="eyebrow">
            <LogIn size={15} />
            Welcome back
          </span>
          <h1>로그인</h1>
          <p>오늘 날씨에 맞는 착장 추천을 받으려면 로그인해주세요.</p>
        </div>

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
              placeholder="비밀번호"
            />
          </div>
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          <LogIn size={17} />
          {loading ? "로그인 중" : "로그인"}
        </button>

        <div className="auth-footer">
          <span>아직 계정이 없나요?</span>
          <Link to="/signup">
            <UserPlus size={16} />
            회원가입
          </Link>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
