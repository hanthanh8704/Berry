package com.example.be.dto.request.KhachHang;

import com.example.be.utils.common.PageableRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangRequest extends PageableRequest {
    private Integer id;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private String gioiTinh;
}
