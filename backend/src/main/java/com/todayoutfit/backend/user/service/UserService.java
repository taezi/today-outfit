package com.todayoutfit.backend.user.service;

import com.todayoutfit.backend.user.dto.UserUpdateRequest;
import com.todayoutfit.backend.user.dto.UserResponse;
import com.todayoutfit.backend.user.entity.User;
import com.todayoutfit.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        return toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        if (userRepository.existsByNicknameAndIdNot(request.nickname(), id)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        user.updateProfile(
                request.nickname(),
                request.gender(),
                request.ageGroup(),
                request.preferredStyle(),
                request.coldSensitivity(),
                request.heatSensitivity()
        );

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
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
