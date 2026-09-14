import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
    <section className="page-section narrow-section">
      <h1>로그인</h1>
      <form className="form-panel" onSubmit={handleSubmit}>
        <label>
          이메일
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "로그인 중" : "로그인"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
