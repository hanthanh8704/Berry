package com.example.be.dto.admin.request.color;

import com.example.be.utils.common.PageableRequest;
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
public class ColorRequest extends PageableRequest {
    private Integer id;
    private String hexCode;
    @NotEmpty(message = "Color name cannot be empty!")  // Đổi thông báo từ tiếng Việt sang tiếng Anh
    private String name;  // Đổi từ ten -> name

    private String status;  // Đổi từ trangThai -> status

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp createdAt;  // Đổi từ ngayTao -> createdAt

}
