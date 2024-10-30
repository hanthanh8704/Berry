package com.example.be.utils.converter.client;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.entities.Employee;
import com.example.be.repositories.admin.EmployeeRepository;
import com.example.be.repositories.admin.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.text.Normalizer;
import java.util.Objects;

@Component
public class EmployeeConverter {

    @Autowired
    private EmployeeRepository nhanVienRepository;


    @Autowired
    private RoleRepository chucVuRepository;

    public Employee convertRequestToEntity(EmployeeRequest request) {
        String generatedMa = generateEmployeeCode(request.getName());
        return Employee.builder()
                .code(generatedMa)
//                .code(request.getCode())
                .name(request.getName())
                .detailedAddress(request.getDetailedAddress())
                .dateOfBirth(request.getDateOfBirth())
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .nationalId(request.getNationalId())
                .email(request.getEmail())
                .image(String.valueOf(request.getImage()))
                .build();
    }

    private String removeAccents(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    private String generateEmployeeCode(String name) {
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();

        // Lấy tên (từ cuối cùng trong parts)
        if (parts.length > 0) {
            String lastName = parts[parts.length - 1];
            sb.append(removeAccents(lastName).substring(0, Math.min(removeAccents(lastName).length(), 5)).toLowerCase());
        }

        // Lấy họ và tên đệm (các từ đầu tiên trong parts)
        for (int i = 0; i < parts.length - 1; i++) {
            String part = parts[i];
            sb.append(removeAccents(part).substring(0, 1).toLowerCase()); // Lấy ký tự đầu tiên và chuyển về lowercase
        }

        // Thêm số thứ tự để đảm bảo tính duy nhất của mã
        return getUniqueEmployeeCode(sb.toString());
    }



    private String getUniqueEmployeeCode(String baseCode) {
        int suffix = 1;
        String candidateCode = baseCode + suffix;

        // Kiểm tra tính duy nhất của mã, nếu mã đã tồn tại thì tăng suffix
        while (nhanVienRepository.existsByCode(candidateCode)) {
            suffix++;
            candidateCode = baseCode + suffix;
        }
        return candidateCode;
    }

    public Employee convertRequestToEntity(Integer id, EmployeeRequest request) {
        Employee employee = nhanVienRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("NhanVien with ID " + id + " not found"));
        employee.setImage(String.valueOf(request.getImage()));
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setCode(request.getCode());
        employee.setEmail(request.getEmail());
        employee.setName(request.getName());
        employee.setNationalId(request.getNationalId());
        employee.setDetailedAddress(request.getDetailedAddress());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setGender(request.getGender());
        employee.setStatus(request.getStatus());

        return employee;
    }

}