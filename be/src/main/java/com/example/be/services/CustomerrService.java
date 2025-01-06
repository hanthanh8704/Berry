package com.example.be.services;

import com.example.be.repositories.admin.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerrService {

    @Autowired
    private CustomerRepository customerRepository;

    // Hàm tạo mã khách hàng mới
    public String generateCustomerCode() {
        // Lấy mã khách hàng lớn nhất hiện có
        String lastCustomerCode = customerRepository.findMaxCustomerCode();

        // Nếu chưa có khách hàng nào, bắt đầu từ C001
        if (lastCustomerCode == null) {
            return "C001";
        }

        try {
            // Kiểm tra định dạng của mã khách hàng
            if (!lastCustomerCode.matches("C\\d+")) {
                throw new RuntimeException("Mã khách hàng không đúng định dạng: " + lastCustomerCode);
            }

            // Tách phần số từ mã khách hàng, ví dụ "C001" -> 1
            int customerNumber = Integer.parseInt(lastCustomerCode.substring(1));

            // Tăng mã lên 1 và tạo mã mới
            return String.format("C%03d", customerNumber + 1);

        } catch (NumberFormatException e) {
            throw new RuntimeException("Không thể sinh mã khách hàng từ: " + lastCustomerCode, e);
        }
    }
}
