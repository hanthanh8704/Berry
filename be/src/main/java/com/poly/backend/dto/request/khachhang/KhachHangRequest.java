package com.poly.backend.dto.request.khachhang;


import com.poly.backend.entity.English.Account;
import com.poly.backend.entity.English.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class KhachHangRequest {

    private Integer id;

    private String code;
    private MultipartFile image;

    private String imageStr;
    private String fullName;

    private String gender;

    private Date dateOfBirth;


    private String phoneNumber;


    private String email;


    private String status;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;
    private Boolean deleted;

    private Account account;

    private List<Address> listAddress;
}
