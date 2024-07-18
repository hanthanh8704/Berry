package com.example.be.dto.request.size;

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
public class KichCoRequest extends PageableRequest {
    private Integer id;
    @NotEmpty(message = "Kích cỡ không được để trống!")
    private String ten;
    private String trangThai;
    private Timestamp ngayTao;

}
