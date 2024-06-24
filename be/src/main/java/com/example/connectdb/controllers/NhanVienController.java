package com.example.connectdb.controllers;

import com.example.demo.entity.NhanVien;
import com.example.demo.repository.assignment1.NhanVienRepository;
import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("nhan-vien")
public class NhanVienController {
    NhanVienRepository nhanVienRepository = new NhanVienRepository();
    List<NhanVien> listNV = new ArrayList<>();

    @GetMapping("index")
    public String getIndex(Model model, @RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "5") int size,
                           @RequestParam(name = "timKiem", defaultValue = "") String timKiem, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        } else {
            listNV = timKiem.isEmpty() ? nhanVienRepository.findAllPaging(page, size)
                    : this.nhanVienRepository.findByTimKiem(timKiem);
            if (listNV.isEmpty()) {
                model.addAttribute("error", "Bảng trống");
            } else {
                model.addAttribute("listNV", listNV);
            }

            model.addAttribute("currentPage", page);
            model.addAttribute("pageSize", size);
            model.addAttribute("totalPages", (int) Math.ceil((double) nhanVienRepository.findAll().size() / size));
            return "nhan_vien/index";
        }
    }

    @GetMapping("delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        this.nhanVienRepository.deleteById(id);
        return "redirect:/nhan-vien/index";
    }

    @GetMapping("create")
    public String create(@ModelAttribute("data") NhanVien nv, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        return "nhan_vien/create";
    }

    @PostMapping("store")
    public String store(Model model, @Valid NhanVien nv, BindingResult validateResult) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("data", nv);
            return "nhan_vien/create";
        }
        nhanVienRepository.create(nv);
        return "redirect:/nhan-vien/index";

    }

    @GetMapping("edit/{id}")
    public String edit(Model model, @PathVariable("id") Integer id, HttpSession session) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        NhanVien listNVDetail = this.nhanVienRepository.findById(id);
        model.addAttribute("listNVDetail", listNVDetail);
        return "nhan_vien/edit";
    }

    @PostMapping("update/{id}")
    public String update(@PathVariable("id") Integer id, @Valid NhanVien nv, BindingResult validateResult, Model model) {
        if (validateResult.hasErrors()) {
            List<FieldError> listError = validateResult.getFieldErrors();
            Map<String, String> errors = new HashMap<>();
            for (FieldError fe : listError) {
                errors.put(fe.getField(), fe.getDefaultMessage());
            }
            model.addAttribute("errors", errors);
            model.addAttribute("listNVDetail", nv);
            return "nhan_vien/edit";
        }
        nv.setId(id); // Đặt id cho nhân viên cần cập nhật
        nhanVienRepository.update(nv);
        return "redirect:/nhan-vien/index";
    }

    @GetMapping("export")
    public void export(HttpServletResponse response) throws IOException {
        List<NhanVien> listNV = nhanVienRepository.findAll(); // Lấy danh sách nhân viên

        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename=nhan_vien.xlsx");

        try (Workbook workbook = new XSSFWorkbook(); OutputStream out = response.getOutputStream()) {
            Sheet sheet = workbook.createSheet("NhanVien");

            // Tạo hàng tiêu đề
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "MaNV", "Tên nhân viên", "Tên đăng nhập", "Mật khẩu", "Trạng thái"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            // Điền dữ liệu vào các hàng
            int rowNum = 1;
            for (NhanVien nv : listNV) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(nv.getId());
                row.createCell(1).setCellValue(nv.getMa());
                row.createCell(2).setCellValue(nv.getTen());
                row.createCell(3).setCellValue(nv.getTenDN());
                row.createCell(4).setCellValue(nv.getMatKhau());
                row.createCell(5).setCellValue(nv.getTrangThai());
            }

            workbook.write(out);
        }
    }
}
