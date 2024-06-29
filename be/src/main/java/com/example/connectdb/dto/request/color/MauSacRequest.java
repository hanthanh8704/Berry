package com.example.connectdb.dto.request.color;

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
public class MauSacRequest extends PageableRequest {
    private Integer id;
    @NotEmpty(message = "Màu sắc không được để trống!")
    private String ten;
    private String trangThai;
    private Timestamp ngayTao;

}
