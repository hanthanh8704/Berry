package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.entities.Customer;
import com.example.be.services.CustomerService;
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
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public PageableObject<CustomerResponse> getAll(CustomerRequest request) {
        return customerService.getAll(request);
    }
    @GetMapping("/{id}")
    public Customer getOne(@PathVariable Integer id ) {
        return customerService.getOne(id);
    }
    @GetMapping("/kh/{id}")
    public Customer getOneCustomer(@PathVariable Integer id) {
        return customerService.getOneCustomer(id);
    }

//    @PostMapping
//    public ResponseObject create(@ModelAttribute @Valid CustomerRequest request, HttpServletRequest httpRequest, AuthRequest registerRequest) {
//        return new ResponseObject(customerService.create(request, httpRequest,registerRequest)); // Pass the httpRequest to the service
//    }
@PostMapping
public ResponseEntity<Object> create(
        @ModelAttribute CustomerRequest request,
        HttpServletRequest httpRequest,
        AuthRequest registerRequest) {
    try {
        Customer savedKH = customerService.create(request, httpRequest, registerRequest);
        return ResponseEntity.ok(new ResponseObject(savedKH));
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


//    @PutMapping("/{id}")
//    public ResponseObject update(@PathVariable Integer id,
//                                 @ModelAttribute @Valid CustomerRequest request, HttpServletRequest httpRequest) {
//        return new ResponseObject(customerService.update(id, request,httpRequest));
//    }
@PutMapping("/{id}")
public ResponseEntity<Object> updateNhanVien(
        @ModelAttribute @Valid CustomerRequest request,HttpServletRequest httpRequest,
        @PathVariable Integer id) {
    try {
        // Thực hiện cập nhật
        Customer updatedKH = customerService.update(id,request,httpRequest);
        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Cập nhật khách hàng thành công.",
                        "data", updatedKH
                )
        );
    } catch (RuntimeException e) {
        // Lỗi do dữ liệu không hợp lệ hoặc ID không tồn tại
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "success", false,
                        "message", e.getMessage()
                )
        );
    } catch (Exception e) {
        // Lỗi không xác định
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                        "success", false,
                        "message", "Đã xảy ra lỗi không xác định.",
                        "details", e.getMessage()
                )
        );
    }
}

}
