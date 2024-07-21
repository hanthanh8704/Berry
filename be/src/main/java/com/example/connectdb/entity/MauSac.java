package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "mau_sac")
public class MauSac {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code_hex")
    private String code_hex;

    @Column(name = "ten")
    private String ten;

    @Column(name = "ngay_tao")
    @CreationTimestamp
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    @UpdateTimestamp
    private Timestamp ngaySua;

    @Column(name = "trang_thai")
    private String trangThai;
}
