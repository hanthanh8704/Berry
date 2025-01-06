package com.example.be.controllers.client;

import com.example.be.entities.Account;
import com.example.be.services.AuthService;

import com.example.be.services.ClientAuthService;
import com.example.be.utils.security.auth.AuthClientRequest;
import com.example.be.utils.security.auth.AuthRequest;
import com.example.be.utils.security.auth.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.RoleNotFoundException;
import java.util.Map;

@RestController
@RequestMapping("/api/client/auth")
public class ClientAuthController {

    @Autowired
    private ClientAuthService clientAuthService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthClientRequest authClientRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ");
        }

        try {
            Map<String, Object> response = clientAuthService.register(authClientRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đăng ký thất bại, vui lòng thử lại sau.");
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthClientRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Yêu cầu không hợp lệ");
        }
        try {
            Map<String, Object> response = clientAuthService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }




    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        clientAuthService.changePassword(request.getEmail(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        clientAuthService.logout();
        return ResponseEntity.ok("Đã đăng xuất thành công");
    }


}