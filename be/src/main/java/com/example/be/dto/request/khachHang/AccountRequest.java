package com.example.be.dto.request.khachHang;

import com.example.be.util.common.PageableRequest;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest extends PageableRequest {
    private String email;
    private String password;
    private Integer chucVuId;
}
