package com.example.connectdb.controllers;

import com.example.demo.entity.*;
import com.example.demo.repository.assignment1.*;
import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("hdct")
public class HDCT_Controller {
    @Autowired
    private HDCT_Repository hdctRepository;
    private List<HDCT> listHDCT = new ArrayList<>();
    @Autowired
    private HoaDonRepository hoaDonRepository;
    private List<HoaDon> listHD = new ArrayList<>();
    @Autowired
    private SPCT_Repository spct_repository;
    private List<SPCT> listSPCT = new ArrayList<>();

    @GetMapping("index")
    public String getIndex(Model model, @RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "5") int size,
                           HttpSession session,
                           @RequestParam(name = "idSPCT", defaultValue = "-1") Integer idSPCT) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        } else {
            listHDCT = idSPCT == -1 ? hdctRepository.findAllPaging(page, size)
                    : this.hdctRepository.findByIdHd(idSPCT);
            if (listHDCT.isEmpty()) {
                model.addAttribute("error", "Bảng trống");
            } else {
                listHD = this.hoaDonRepository.findAll();
                model.addAttribute("listHD", listHD);

                model.addAttribute("listHDCT", listHDCT);

                listSPCT = this.spct_repository.findAll();
                model.addAttribute("listSPCT", listSPCT);
            }
            model.addAttribute("listHD", listHD);
            model.addAttribute("currentPage", page);
            model.addAttribute("pageSize", size);
            model.addAttribute("totalPages", (int) Math.ceil((double) hdctRepository.findAll().size() / size));
            return "hdct/index";
        }
    }

    @GetMapping("delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        this.hdctRepository.deleteById(id);
        return "redirect:/hdct/index";
    }

    @GetMapping("create")
    public String create(@ModelAttribute("data") HoaDon hd, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        return "hdct/create";
    }

    @PostMapping("store")
    public String store(Model model, @Valid HDCT hdct, BindingResult validateResult) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("data", hdct);
            return "hdct/create";
        }
        hdctRepository.create(hdct);
        return "redirect:/hdct/index";
    }

    @GetMapping("edit/{id}")
    public String edit(Model model, @PathVariable("id") Integer id, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        listHD = this.hoaDonRepository.findAll();
        model.addAttribute("listHD", listHD);

        listSPCT = this.spct_repository.findAll();
        model.addAttribute("listSPCT", listSPCT);

        HDCT listHDCTDetail = this.hdctRepository.findById(id);
        model.addAttribute("listHDCTDetail", listHDCTDetail);
        return "hdct/edit";
    }

    @PostMapping("update/{id}")
    public String update(@PathVariable("id") Integer id, @Valid HDCT hdct, BindingResult validateResult, Model model) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("listHDCTDetail", hdct);

            listHD = this.hoaDonRepository.findAll();
            model.addAttribute("listHD", listHD);

            listSPCT = this.spct_repository.findAll();
            model.addAttribute("listSPCT", listSPCT);

            return "hdct/edit";
        }
        hdct.setId(id);
        hdctRepository.update(hdct);
        return "redirect:/hdct/index";
    }
}
