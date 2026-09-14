import { CircleUserRound, House, LogIn, LogOut, Shirt, UserPlus } from "lucide-react";
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
          <span className="brand-icon">
            <Shirt size={20} />
          </span>
          오늘의 착장
        </NavLink>
        <nav className="app-nav">
          <NavLink to="/">
            <House size={16} />
            홈
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/mypage">
                <CircleUserRound size={16} />
                마이페이지
              </NavLink>
              <span className="nav-user-name">{user?.nickname}님</span>
              <button className="nav-button" type="button" onClick={handleLogout}>
                <LogOut size={16} />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <LogIn size={16} />
                로그인
              </NavLink>
              <NavLink to="/signup">
                <UserPlus size={16} />
                회원가입
              </NavLink>
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
