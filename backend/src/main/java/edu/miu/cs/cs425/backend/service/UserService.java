package edu.miu.cs.cs425.backend.service;

import edu.miu.cs.cs425.backend.data.repository.UserRepository;
import edu.miu.cs.cs425.backend.domain.entity.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create
    public User createUser(User user) {
        if (user.getId() == null || user.getId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (userRepository.findById(user.getId()).isPresent()) {
            throw new IllegalArgumentException("User with ID " + user.getId() + " already exists");
        }
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Read - Find One
    public Optional<User> findUserById(String id) {
        return userRepository.findById(id);
    }

    // Read - Find All
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // Update
    public User updateUser(String id, User userDetails) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setPhone(userDetails.getPhone());
            user.setAddress(userDetails.getAddress());
            user.setAvatar(userDetails.getAvatar());
            user.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User with ID " + id + " not found");
        }
    }

    // Delete
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User with ID " + id + " not found");
        }
        userRepository.deleteById(id);
    }

    // Custom search by email
    public List<User> findUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email);
    }

    // Custom search by name
    public List<User> findUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }
}