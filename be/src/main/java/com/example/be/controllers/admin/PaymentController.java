package com.example.be.controllers.admin;


import com.example.be.dto.admin.request.bill.CreatePaymentsMethodRequest;
import com.example.be.dto.admin.response.payment.PaymentResponse;
import com.example.be.entities.Payment;
import com.example.be.repositories.admin.PaymentRepository;
import com.example.be.services.impl.PaymentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("api/payment")
public class PaymentController {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentServiceImpl paymentService;

    @GetMapping("/{id}")
    public List<PaymentResponse> getAll(@PathVariable("id") Integer id){
        return  paymentRepository.getThanhToanByIdHoaDon(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Integer id,
            @RequestBody CreatePaymentsMethodRequest request
    ) {
        request.setBill(id); // Gắn ID từ URL vào request
        Payment updatedPayment = paymentService.updatePayment(id , request);
        return ResponseEntity.ok(updatedPayment);
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentsMethodRequest request) {
        try {
            // Gọi service để tạo Payment
            Payment createdPayment = paymentService.create(request);

            // Trả về Response với HTTP status 201 CREATED
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
        } catch (IllegalArgumentException ex) {
            // Xử lý lỗi (ví dụ: ID không tồn tại)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception ex) {
            // Xử lý lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}