package com.example.be.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Getter
@Setter
@ToString(exclude = "account")
@Builder
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "image")
    private String image;

    @Column(name = "detailed_address")
    private String detailedAddress;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "email")
    private String email;

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "status")
    private String status;

    @Column(name = "note")
    private String note;
    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "deleted")
    private Boolean deleted;

}
