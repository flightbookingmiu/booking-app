package edu.miu.cs.cs425.backend.presentation.controller;

import edu.miu.cs.cs425.backend.domain.entity.User;
import edu.miu.cs.cs425.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@Tag(name = "User API", description = "Endpoints for managing users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Create a new user", description = "Creates a new user with a unique ID")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(201).body(createdUser);
    }

    @Operation(summary = "Find user by ID", description = "Retrieves details of a specific user by its ID")
    @ApiResponse(responseCode = "200", description = "User details retrieved successfully")
    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable String id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Find all users", description = "Retrieves a list of all users")
    @ApiResponse(responseCode = "200", description = "List of users retrieved successfully")
    @GetMapping
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Update user", description = "Updates the details of an existing user")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete user", description = "Deletes a user by its ID")
    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Search users by email", description = "Retrieves users with emails matching the given pattern")
    @ApiResponse(responseCode = "200", description = "List of matching users retrieved successfully")
    @GetMapping("/search/email")
    public ResponseEntity<List<User>> findUsersByEmail(@RequestParam String email) {
        List<User> users = userService.findUsersByEmail(email);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Search users by name", description = "Retrieves users with names matching the given pattern")
    @ApiResponse(responseCode = "200", description = "List of matching users retrieved successfully")
    @GetMapping("/search/name")
    public ResponseEntity<List<User>> findUsersByName(@RequestParam String name) {
        List<User> users = userService.findUsersByName(name);
        return ResponseEntity.ok(users);
    }
}