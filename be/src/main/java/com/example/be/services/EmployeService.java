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

        try {
            // Kiểm tra mã nhân viên có đúng định dạng không
            if (!lastEmployeeCode.matches("E\\d+")) {
                throw new RuntimeException("Mã nhân viên không đúng định dạng: " + lastEmployeeCode);
            }

            // Tách phần số từ mã nhân viên, ví dụ "E001" -> 1
            int employeeNumber = Integer.parseInt(lastEmployeeCode.substring(1));

            // Tăng mã lên 1 và tạo mã mới
            return String.format("E%03d", employeeNumber + 1);

        } catch (NumberFormatException e) {
            throw new RuntimeException("Không thể sinh mã nhân viên từ: " + lastEmployeeCode, e);
        }
    }
}


