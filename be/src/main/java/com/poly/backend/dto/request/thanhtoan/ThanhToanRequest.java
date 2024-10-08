package com.poly.backend.dto.request.thanhtoan;

import com.poly.backend.entity.English.Bill;
import com.poly.backend.entity.English.Employee;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThanhToanRequest {
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
