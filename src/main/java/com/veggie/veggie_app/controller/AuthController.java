package com.veggie.veggie_app.controller;
import com.veggie.veggie_app.dto.ResetPasswordRequest;

import com.veggie.veggie_app.dto.AuthRequest;
import com.veggie.veggie_app.dto.AuthResponse;
import com.veggie.veggie_app.dto.RegisterRequest;
import com.veggie.veggie_app.model.Role;
import com.veggie.veggie_app.model.User;
import com.veggie.veggie_app.repository.UserRepository;
import com.veggie.veggie_app.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.veggie.veggie_app.dto.ForgotPasswordRequest;
import com.veggie.veggie_app.model.User;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows our React app to connect
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Securely hash password
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {

        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String resetToken = UUID.randomUUID().toString();

            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

            userRepository.save(user);

            return ResponseEntity.ok(
                    "Password reset token generated: " + resetToken
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        try {

            // Check whether token was provided
            if (request.getToken() == null || request.getToken().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Reset token is required");
            }

            // Check whether new password was provided
            if (request.getNewPassword() == null ||
                    request.getNewPassword().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("New password is required");
            }

            // Check password length
            if (request.getNewPassword().length() < 6) {
                return ResponseEntity
                        .badRequest()
                        .body("Password must be at least 6 characters long");
            }

            // Find user using reset token
            User user = userRepository.findByResetToken(request.getToken())
                    .orElseThrow(() ->
                            new RuntimeException("Invalid or expired reset link"));

            // Check token expiry
            if (user.getResetTokenExpiry() == null ||
                    user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {

                return ResponseEntity
                        .badRequest()
                        .body("Your reset link has expired. Please request a new one.");
            }

            // Update password
            user.setPassword(
                    passwordEncoder.encode(request.getNewPassword())
            );

            // Remove reset token after successful password change
            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            userRepository.save(user);

            return ResponseEntity.ok("Password reset successfully");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body("Unable to reset password. Please request a new reset link.");
        }
    }
}