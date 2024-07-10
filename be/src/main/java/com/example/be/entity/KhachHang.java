package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.sql.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "khach_hang")
public class KhachHang {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma")
    private String ma;
    @Nationalized
    @Column(name = "anh")
    private String anh;

    @Column(name = "ho_ten")
    private String hoTen;

    @Column(name = "gioi_tinh")
    private String gioiTinh;
    @Column(name = "ngay_sinh")
    private Date ngaySinh;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "email")
    private String email;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao")
    @CreationTimestamp
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    @UpdateTimestamp
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
    @Column(name = "deleted")
    private Boolean deleted;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private Account account;
}
