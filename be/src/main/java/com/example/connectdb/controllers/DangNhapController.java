package com.example.connectdb.controllers;

import com.example.demo.entity.NhanVien;
import com.example.demo.repository.assignment1.DangNhapRepository;
import com.example.demo.repository.assignment1.NhanVienRepository;
import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class DangNhapController {
    @Autowired
    private DangNhapRepository dangNhapRepository;
    @Autowired
    private NhanVienRepository nhanVienRepository;
    AuthChecker authChecker = new AuthChecker();

    @PostMapping("login")
    public String login(@RequestParam(name = "tenDN") String tenDN,
                        @RequestParam(name = "matKhau") String matKhau,
                        HttpSession session, Model model) {
        NhanVien nv = new NhanVien();
        nv.setTenDN(tenDN);
        nv.setMatKhau(matKhau);
        boolean isValid = dangNhapRepository.validateLogin(nv);
        if (isValid) {
            NhanVien loggedInUser = nhanVienRepository.findByRole(tenDN);
            if (loggedInUser != null && loggedInUser.getVaiTro().equals("Admin")) {
                session.setAttribute("loggedInUser", loggedInUser);
//                session.setAttribute("successMessage", "Đăng nhập thành công!");
                session.removeAttribute("errorMessage");
                System.out.println("Vai trò: " + loggedInUser.getVaiTro());
                System.out.println("Tên: " + loggedInUser.getTen());
                model.addAttribute("loggedInUser",loggedInUser);
                return "redirect:/admin/trang-chu";
            } else if (loggedInUser != null && loggedInUser.getVaiTro().equals("Nhân viên")) {
                session.setAttribute("loggedInUser", loggedInUser);
//                session.setAttribute("successMessage", "Đăng nhập thành công!");
                session.removeAttribute("errorMessage");
                System.out.println("Vai trò: " + loggedInUser.getVaiTro());
                return "redirect:/nhan-vien/trang-chu";
            } else {
                return "login";
            }
        } else {
            model.addAttribute("errorMessage", "Đăng nhập không thành công. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.");
            session.removeAttribute("successMessage");
            model.addAttribute("data", nv);
            return "login";
        }
    }


    @GetMapping("login")
    public String showLogin(HttpSession session, Model model, @ModelAttribute("data") NhanVien nv) {
        model.addAttribute("successMessage", session.getAttribute("successMessage"));
        model.addAttribute("errorMessage", session.getAttribute("errorMessage"));
        return "login";
    }



}

