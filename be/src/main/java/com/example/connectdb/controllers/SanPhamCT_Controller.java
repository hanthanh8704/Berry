package com.example.connectdb.controllers;

import com.example.demo.entity.*;
import com.example.demo.repository.assignment1.KichThuocRepository;
import com.example.demo.repository.assignment1.MauSacRepository;
import com.example.demo.repository.assignment1.SPCT_Repository;
import com.example.demo.repository.assignment1.SanPhamRepository;
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
@RequestMapping("spct")
public class SanPhamCT_Controller {
    private SPCT_Repository spct_repository = new SPCT_Repository();
    List<SPCT> listSPCT = new ArrayList<>();
    private SanPhamRepository sanPhamRepository = new SanPhamRepository();
    List<SanPham> listSP = new ArrayList<>();

    private MauSacRepository mauSacRepository = new MauSacRepository();
    List<MauSac> listMS = new ArrayList<>();

    private KichThuocRepository kichThuocRepository = new KichThuocRepository();
    List<KichThuoc> listKT = new ArrayList<>();

    @GetMapping("index")
    public String getIndex(Model model, @RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "5") int size,
                           @RequestParam(name = "idSanPham", defaultValue = "-1") Integer idSanPham, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        } else {
            listSPCT = idSanPham == -1 ? spct_repository.findAllPaging(page, size) : this.spct_repository.findByIdSp(idSanPham);
            if (listSPCT.isEmpty()) {
                model.addAttribute("error", "Bảng trống");
            } else {
                listSP = sanPhamRepository.findAll();
                model.addAttribute("listSP", listSP);

                model.addAttribute("listSPCT", listSPCT);
            }
            model.addAttribute("listSP", listSP);

            model.addAttribute("currentPage", page);
            model.addAttribute("pageSize", size);
            model.addAttribute("totalPages", (int) Math.ceil((double) spct_repository.findAll().size() / size));
            return "spct/index";
        }
    }

    @GetMapping("delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        this.spct_repository.deleteById(id);
        return "redirect:/spct/index";
    }

    @GetMapping("create")
    public String create(@ModelAttribute("data") SPCT spct, Model model, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        listSP = sanPhamRepository.findAll();
        model.addAttribute("listSP", listSP);
        listMS = mauSacRepository.findAll();
        model.addAttribute("listMS", listMS);
        listKT = kichThuocRepository.findAll();
        model.addAttribute("listKT", listKT);
        return "spct/create";
    }

    @PostMapping("store")
    public String store(Model model, @Valid SPCT spct, BindingResult validateResult) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            listSP = sanPhamRepository.findAll();
            model.addAttribute("listSP", listSP);
            listMS = mauSacRepository.findAll();
            model.addAttribute("listMS", listMS);
            listKT = kichThuocRepository.findAll();
            model.addAttribute("listKT", listKT);
            model.addAttribute("errors", errors);
            model.addAttribute("data", spct);
            return "spct/create";
        }
        spct_repository.create(spct);
        return "redirect:/spct/index";
    }

    @GetMapping("edit/{id}")
    public String edit(Model model, @PathVariable("id") Integer id, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        SPCT listSPCTDetail = this.spct_repository.findById(id);
        model.addAttribute("listSPCTDetail", listSPCTDetail);
        listSP = sanPhamRepository.findAll();
        model.addAttribute("listSP", listSP);
        listMS = mauSacRepository.findAll();
        model.addAttribute("listMS", listMS);
        listKT = kichThuocRepository.findAll();
        model.addAttribute("listKT", listKT);
        return "spct/edit";
    }

    @PostMapping("update/{id}")
    public String update(@PathVariable("id") Integer id, @Valid SPCT spct, BindingResult validateResult, Model model) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("listSPCTDetail", spct);
            listSP = sanPhamRepository.findAll();
            model.addAttribute("listSP", listSP);
            listMS = mauSacRepository.findAll();
            model.addAttribute("listMS", listMS);
            listKT = kichThuocRepository.findAll();
            model.addAttribute("listKT", listKT);
            return "spct/edit";
        }
        spct.setId(id);
        spct_repository.update(spct);
        return "redirect:/spct/index";
    }
}
