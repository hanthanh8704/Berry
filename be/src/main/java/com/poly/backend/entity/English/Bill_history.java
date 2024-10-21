package com.poly.backend.entity.English;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "bill_history")
public class Bill_history {
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
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusBil status;

    @Column(name = "action_description")
    private String actionDescription;
    @CreationTimestamp
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
