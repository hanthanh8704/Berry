package com.example.be.services;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.entities.Customer;
import com.example.be.utils.common.PageableObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public interface CustomerService {
    PageableObject<CustomerResponse> getAll(CustomerRequest request);
    Customer getOne(Integer id);

    Customer getOneCustomer(Integer id);


    Customer create(CustomerRequest request);

    Customer update(Integer id, CustomerRequest request);
}
