package com.example.be.services;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Employee;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.security.auth.AuthRequest;
import jakarta.servlet.http.HttpServletRequest;


public interface EmployeeService {
    PageableObject<EmployeeResponse> getAll(EmployeeRequest request);
    Employee createEmployee(EmployeeRequest request, String vaiTro, HttpServletRequest httpRequest, AuthRequest registerRequest);

    EmployeeResponse getOne(Integer id);

    Employee getEmployeeById(Integer id);

    Employee update(Integer idNV, EmployeeRequest employeeRequest);
}
