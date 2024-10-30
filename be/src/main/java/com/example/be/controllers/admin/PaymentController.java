package com.example.be.controllers.admin;

import com.example.be.dto.admin.response.payment.PaymentResponse;
import com.example.be.entities.Payment;
import com.example.be.repositories.admin.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("api/payment")
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/{id}")
    public PaymentResponse getAll(@PathVariable Integer id){
        return paymentRepository.findByBill(id);
    }
}