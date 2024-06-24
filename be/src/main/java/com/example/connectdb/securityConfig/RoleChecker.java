package com.example.connectdb.securityConfig;

import com.example.demo.entity.NhanVien;
import jakarta.servlet.http.HttpSession;

public class RoleChecker {
    public static boolean hasRole(HttpSession session, String role) {
        NhanVien loggedInUser = (NhanVien) session.getAttribute("loggedInUser");
        return loggedInUser != null && loggedInUser.getVaiTro().equalsIgnoreCase(role);
    }
}
