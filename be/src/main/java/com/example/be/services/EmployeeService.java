package com.example.be.services;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Employee;
import com.example.be.utils.common.PageableObject;



public interface EmployeeService {
    PageableObject<EmployeeResponse> getAll(EmployeeRequest request);
    Employee createEmployee(EmployeeRequest request, String vaiTro);

    EmployeeResponse getOne(Integer id);

    Employee getEmployeeById(Integer id);

    Employee update(Integer idNV, EmployeeRequest employeeRequest);
}
