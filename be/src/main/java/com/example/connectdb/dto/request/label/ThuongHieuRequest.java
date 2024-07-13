package com.example.connectdb.dto.request.label;

import com.example.connectdb.util.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ThuongHieuRequest extends PageableRequest {
    private Integer id;
    @NotEmpty(message = "Thương Hiệu không được để trống!")
    private String ten;
    private String trangThai;
    private Timestamp ngayTao;
}
