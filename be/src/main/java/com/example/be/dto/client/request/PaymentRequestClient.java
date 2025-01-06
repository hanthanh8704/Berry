package com.example.be.dto.client.request;

import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequestClient {
    private Integer id;
    private Bill bill;
    private Employee employee;
    private String method;
    private String transactionNo;
    private LocalDateTime transactionDate;
    private BigDecimal totalMoney;
    private String status;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
