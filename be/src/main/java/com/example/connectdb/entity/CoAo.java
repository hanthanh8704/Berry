package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "co_ao")
public class CoAo {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
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
