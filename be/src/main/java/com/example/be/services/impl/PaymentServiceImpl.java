package com.example.be.services.impl;


import com.example.be.dto.admin.request.bill.CreatePaymentsMethodRequest;

import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import com.example.be.entities.Payment;
import com.example.be.repositories.admin.BillRepository;
import com.example.be.repositories.admin.EmployeeRepository;
import com.example.be.repositories.admin.PaymentRepository;
import com.example.be.utils.constant.StatusPayMents;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentServiceImpl {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private BillRepository billRepository;

    public Payment updatePayment(Integer id, CreatePaymentsMethodRequest request) {
        // Lấy thông tin nhân viên từ request
        Employee employee = employeeRepository.findById(request.getEmployee())
                .orElseThrow(() -> new IllegalArgumentException("Employee ID không tồn tại: " + request.getEmployee()));

        // Kiểm tra xem payment có tồn tại không
        Optional<Payment> optionalPayment = paymentRepository.findById(id);

        if (optionalPayment.isEmpty()) {
            throw new IllegalArgumentException("Payment with ID " + request.getBill() + " not found");
        }

        // Lấy đối tượng payment
        Payment payment = optionalPayment.get();
        payment.setEmployee(employee);

        // Nếu trạng thái là HOAN_TIEN, gán transactionNo từ request
        if (payment.getStatus() == StatusPayMents.HOAN_TIEN) {
            payment.setTransactionNo(request.getTransactionNo());  // Gán mã giao dịch
        }

        // Cập nhật trạng thái thanh toán
        payment.setStatus(StatusPayMents.DA_THANH_TOAN);
        return paymentRepository.save(payment);
    }


    public Payment create(CreatePaymentsMethodRequest request) {
        // Tìm Employee từ database bằng employeeId
        Employee employee = employeeRepository.findById(request.getEmployee())
                .orElseThrow(() -> new IllegalArgumentException("Employee ID không tồn tại: " + request.getEmployee()));

        // Tìm Bill từ database bằng billId
        Bill bill = billRepository.findById(request.getBill())
                .orElseThrow(() -> new IllegalArgumentException("Bill ID không tồn tại: " + request.getBill()));

        // Khởi tạo đối tượng Payment
        Payment payment = new Payment();
        payment.setMethod(request.getMethod());
        payment.setStatus(request.getStatus());
        payment.setEmployee(employee);
        payment.setTotalMoney(request.getTotalMoney());
        payment.setTransactionNo(request.getTransactionNo());
        payment.setBill(bill);

        // Lưu đối tượng Payment vào database
        return paymentRepository.save(payment);
    }


}

