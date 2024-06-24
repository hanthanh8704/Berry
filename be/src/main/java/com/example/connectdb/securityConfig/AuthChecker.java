package com.example.connectdb.securityConfig;

import com.example.demo.entity.NhanVien;
import jakarta.servlet.http.HttpSession;

public class AuthChecker {
    public static boolean isLoggedIn(HttpSession session) {
        NhanVien loggedInUser = (NhanVien) session.getAttribute("loggedInUser");
        return loggedInUser != null;
    }
}
