package com.todayoutfit.backend.auth.service;

import com.todayoutfit.backend.auth.dto.LoginRequest;
import com.todayoutfit.backend.auth.dto.LoginResponse;
import com.todayoutfit.backend.auth.dto.SignupRequest;
import com.todayoutfit.backend.auth.dto.SignupResponse;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByNickname(request.nickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname(),
                request.gender(),
                request.ageGroup(),
                request.preferredStyle(),
                request.coldSensitivity(),
                request.heatSensitivity()
        );

        User savedUser = userRepository.save(user);

        return new SignupResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getNickname(),
                savedUser.getGender(),
                savedUser.getAgeGroup(),
                savedUser.getPreferredStyle(),
                savedUser.getColdSensitivity(),
                savedUser.getHeatSensitivity()
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getGender(),
                user.getAgeGroup(),
                user.getPreferredStyle(),
                user.getColdSensitivity(),
                user.getHeatSensitivity()
        );
    }
}
