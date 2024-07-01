package com.example.be.dto.request.nhanVien;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienDto {

    private Integer id;

    private String ten;

    private Integer tuoi;

    private String diaChi;

    private String trangThai;

    private Integer idAnh ;
}
