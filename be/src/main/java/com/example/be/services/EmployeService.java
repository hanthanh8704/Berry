package com.example.be.services;

import com.example.be.repositories.admin.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Hàm tạo mã nhân viên mới
    public String generateEmployeeCode() {
        // Lấy mã nhân viên lớn nhất hiện có
        String lastEmployeeCode = employeeRepository.findMaxEmployeeCode();

        if (lastEmployeeCode == null) {
            return "E001"; // Nếu chưa có nhân viên nào thì bắt đầu từ E001
        }

        // Tách phần số từ mã nhân viên, ví dụ "E001" -> 1
        int employeeNumber = Integer.parseInt(lastEmployeeCode.substring(1));

        // Tăng mã lên 1 và tạo mã mới
        String newEmployeeCode = String.format("E%03d", employeeNumber + 1);

        return newEmployeeCode;
    }
}

