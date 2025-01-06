package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Employee;
import com.example.be.services.EmployeeService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import com.example.be.utils.security.auth.AuthRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/nhan-vien")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    private static String vaiTro ="Nhân viên";
    @GetMapping
    public PageableObject<EmployeeResponse> getAll(EmployeeRequest request) {
        return employeeService.getAll(request);
    }

    // Ham them Nhan vien vao REST API
    @PostMapping("/create")
    public ResponseEntity<Object> createNhanVien(
            @ModelAttribute EmployeeRequest employeeRequest,
            HttpServletRequest httpRequest,
            AuthRequest registerRequest) {
        try {
            Employee savedNhanVien = employeeService.createEmployee(employeeRequest, vaiTro, httpRequest, registerRequest);
            return ResponseEntity.ok(new ResponseObject(savedNhanVien));
        } catch (RuntimeException e) {
            // Trả lỗi với thông điệp rõ ràng
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateNhanVien(
            @ModelAttribute @Valid EmployeeRequest request,
            @PathVariable Integer id) {
        try {
            // Thực hiện cập nhật
            Employee updatedNhanVien = employeeService.update(id, request);
            return ResponseEntity.ok(new ResponseObject(updatedNhanVien));
        } catch (RuntimeException e) {
            // Trường hợp lỗi (ví dụ: ID không tồn tại)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );
        } catch (Exception e) {
            // Trường hợp lỗi không xác định
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "success", false,
                            "message", "Đã xảy ra lỗi không xác định."
                    )
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getNhanVien(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(employeeService.getOne(id), HttpStatus.OK);
    }

}
