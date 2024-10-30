package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Employee;
import com.example.be.services.EmployeeService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseObject createNhanVien(@ModelAttribute EmployeeRequest employeeRequest) {
        Employee savedNhanVien = employeeService.createEmployee(employeeRequest,vaiTro);
        return new ResponseObject(savedNhanVien);
    }

    @PutMapping("/update/{id}")
    public ResponseObject updateNhanVien(@ModelAttribute @Valid EmployeeRequest request, @PathVariable Integer id) {
        return new ResponseObject(employeeService.update(id,request));
    }
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getNhanVien(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(employeeService.getOne(id), HttpStatus.OK);
    }

}
