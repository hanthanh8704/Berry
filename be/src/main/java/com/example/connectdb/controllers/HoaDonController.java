package com.example.connectdb.controllers;

import com.example.demo.entity.HoaDon;
import com.example.demo.entity.KhachHang;
import com.example.demo.entity.NhanVien;
import com.example.demo.repository.assignment1.HoaDonRepository;
import com.example.demo.repository.assignment1.KhachHangRepository;
import com.example.demo.repository.assignment1.NhanVienRepository;
import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("hoa-don")
public class HoaDonController {
    HoaDonRepository hoaDonRepository = new HoaDonRepository();
    List<HoaDon> listHD = new ArrayList<>();
    NhanVienRepository nhanVienRepository = new NhanVienRepository();
    List<NhanVien> listNV = new ArrayList<>();
    KhachHangRepository khachHangRepository = new KhachHangRepository();
    List<KhachHang> listKH = new ArrayList<>();

    @GetMapping("index")
    public String getIndex(Model model, @RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "5") int size,
                           @RequestParam(name = "idKH", defaultValue = "-1") Integer idKH, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        } else {
            listHD = idKH == -1 ? hoaDonRepository.findAllPaging(page, size)
                    : this.hoaDonRepository.findByIdKh(idKH);
            if (listHD.isEmpty()) {
                model.addAttribute("error", "Bảng trống");
            } else {
                model.addAttribute("listHD", listHD);
                listNV = this.nhanVienRepository.findAll();
                model.addAttribute("listNV", listNV);
                listKH = this.khachHangRepository.findAll();
                model.addAttribute("listKH", listKH);
            }
            model.addAttribute("listKH", listKH);

            model.addAttribute("currentPage", page);
            model.addAttribute("pageSize", size);
            model.addAttribute("totalPages", (int) Math.ceil((double) khachHangRepository.findAll().size() / size));
            return "hoa_don/index";
        }
    }

    @GetMapping("delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        this.hoaDonRepository.deleteById(id);
        return "redirect:/hoa-don/index";
    }

    @GetMapping("create")
    public String create(@ModelAttribute("data") HoaDon hd, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        return "hoa_don/create";
    }

    @PostMapping("store")
    public String store(Model model, @Valid HoaDon hd, BindingResult validateResult) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("data", hd);
            return "hoa_don/create";
        }
        hoaDonRepository.create(hd);
        return "redirect:/hoa-don/index";
    }

    @GetMapping("edit/{id}")
    public String edit(Model model, @PathVariable("id") Integer id, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
//        listNV = this.nhanVienRepository.findAll();
//        model.addAttribute("listNV", listNV);
//        listKH = this.khachHangRepository.findAll();
//        model.addAttribute("listKH", listKH);

        HoaDon listHDDetail = this.hoaDonRepository.findById(id);
        model.addAttribute("listHDDetail", listHDDetail);

        listNV = this.nhanVienRepository.findAll();
        model.addAttribute("listNV", listNV);
        listKH = this.khachHangRepository.findAll();
        model.addAttribute("listKH", listKH);

        return "hoa_don/edit";
    }

    @PostMapping("update/{id}")
    public String update(@PathVariable("id") Integer id, @Valid HoaDon hd, BindingResult validateResult, Model model) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("listHDDetail", hd);

            listNV = this.nhanVienRepository.findAll();
            model.addAttribute("listNV", listNV);
            listKH = this.khachHangRepository.findAll();
            model.addAttribute("listKH", listKH);

            return "hoa_don/edit";
        }
        hd.setId(id);
        hoaDonRepository.update(hd);
        return "redirect:/hoa-don/index";
    }
}
