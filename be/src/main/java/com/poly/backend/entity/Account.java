//package com.poly.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Getter
//@Setter
//@ToString
//@Builder
//@Table(name = "account")
//@AllArgsConstructor
//@NoArgsConstructor
//public class Account {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @Column(name = "email")
//    private String email;
//    @Column(name = "password")
//    private String password;
//    @ManyToOne
//    @JoinColumn(name = "id_chuc_vu")
//    private ChucVu chucVu;
//}
