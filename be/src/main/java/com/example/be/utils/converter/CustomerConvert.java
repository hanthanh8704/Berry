package com.example.be.utils.converter;//package com.example.be.utils.converter;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.entities.Customer;
import com.example.be.repositories.admin.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class CustomerConvert {

    @Autowired
    private CustomerRepository accountRepository;
    public Customer convertRequestToEntity(CustomerRequest request){
        return Customer.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .status(request.getStatus())
                .dateOfBirth(request.getDateOfBirth())

                .build();
    }

    public Customer convertRequestToEntity(Integer id, CustomerRequest request) {
        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
        Customer customer = accountRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));
        customer.setCode(request.getCode());
        customer.setFullName(request.getFullName());
        customer.setStatus(request.getStatus());
        customer.setGender(request.getGender());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setEmail(request.getEmail());
        customer.setUpdatedAt(request.getUpdatedAt());
        return customer;
    }
}
