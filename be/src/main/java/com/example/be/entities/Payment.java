package com.example.be.entities;

import com.example.be.utils.constant.StatusMethod;
import com.example.be.utils.constant.StatusPayMents;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private StatusMethod method;

    @Column(name = "transaction_no")
    private String transactionNo;

    @Column(name = "transaction_date")
    private Timestamp transactionDate;

    @Column(name = "total_money")
    private BigDecimal totalMoney;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusPayMents status;
    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
