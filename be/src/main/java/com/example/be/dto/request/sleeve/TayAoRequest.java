package com.example.be.dto.request.sleeve;

import com.example.be.util.common.PageableRequest;
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
public class TayAoRequest extends PageableRequest {
    private Integer id;

    @NotEmpty(message = "Tên tay áo không được để trống!")
    private String ten;
    private String trangThai;
    private Timestamp ngayTao;
}
