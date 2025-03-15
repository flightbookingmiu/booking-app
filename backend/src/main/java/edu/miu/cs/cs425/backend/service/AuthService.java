package edu.miu.cs.cs425.backend.service;

import edu.miu.cs.cs425.backend.domain.entity.User;
import edu.miu.cs.cs425.backend.dto.AuthResponse;
import edu.miu.cs.cs425.backend.dto.LoginRequest;
import edu.miu.cs.cs425.backend.dto.SignupRequest;
import edu.miu.cs.cs425.backend.data.repository.UserRepository;
import edu.miu.cs.cs425.backend.config.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(BCrypt.hashpw(request.password(), BCrypt.gensalt()));
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setAvatar("/profiles/default-avatar.jpg");
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!BCrypt.checkpw(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getRole());
    }
}