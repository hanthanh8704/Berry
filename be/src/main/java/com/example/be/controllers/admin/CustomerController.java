package com.example.be.controllers.admin;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.entities.Customer;
import com.example.be.services.CustomerService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Customer getOne(Integer id) {
        return customerService.getOne(id);
    }
    @GetMapping("/kh/{id}")
    public Customer getOneCustomer(@PathVariable Integer id) {
        return customerService.getOneCustomer(id);
    }

    @PostMapping
    public ResponseObject create(@ModelAttribute @Valid CustomerRequest request) {
        return new ResponseObject(customerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Integer id,
                                 @ModelAttribute @Valid CustomerRequest request) {
        return new ResponseObject(customerService.update(id, request));
    }

}
