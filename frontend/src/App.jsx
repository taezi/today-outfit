import { NavLink, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainPage from "./pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import MyPage from "./pages/MyPage.jsx";
import { logout } from "./store/authSlice.js";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    alert("로그아웃하였습니다.");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand-link" to="/">
          오늘의 착장
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/">메인</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/mypage">마이페이지</NavLink>
              <span className="nav-user-name">{user?.nickname}님</span>
              <button className="nav-button" type="button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
