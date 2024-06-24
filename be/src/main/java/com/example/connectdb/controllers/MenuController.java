package com.example.connectdb.controllers;

import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MenuController {
    @GetMapping("admin/trang-chu")
    public String admin(HttpSession session, Model model ) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        return "menu";
    }
    @GetMapping("nhan-vien/trang-chu")
    public String nhanVien(HttpSession session, Model model) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        return "menu";
    }
}
