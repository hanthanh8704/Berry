package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "chuc_vu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChucVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ngay_tao", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime ngaySua;

    @Column(name = "vai_tro", nullable = false)
    private String vaiTro;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @OneToMany(mappedBy = "chucVu", cascade = CascadeType.ALL)
    private Set<Account> accounts;

}

