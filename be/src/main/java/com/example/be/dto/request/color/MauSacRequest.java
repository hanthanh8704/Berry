package com.example.be.dto.request.color;

import com.example.be.util.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MauSacRequest extends PageableRequest {
    private Integer id;
    private String code;
    @NotEmpty(message = "Màu sắc không được để trống!")
    private String ten;
    private String trangThai;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayTao;

}
