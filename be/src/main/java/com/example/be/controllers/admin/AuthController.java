package com.example.be.controllers.admin;

import com.example.be.services.AuthService;
import com.example.be.utils.security.auth.AuthRequest;
import com.example.be.utils.security.auth.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest registerRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Yêu cầu không hợp lệ");
        }

        try {
            Map<String, Object> response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Yêu cầu không hợp lệ");
        }

        try {
            Map<String, Object> response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // Lấy thông tin người dùng hiện tại
    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        try {
            Map<String, Object> currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // Đăng xuất
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        authService.logout();
        return ResponseEntity.ok("Đã đăng xuất thành công");
    }

    // Đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Yêu cầu không hợp lệ");
        }

        try {
            authService.changePassword(request.getEmail(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
