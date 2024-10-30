package com.example.be.dto.admin.request.employee;

import com.example.be.entities.Account;
import com.example.be.utils.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;

@Setter
@Getter
public class EmployeeRequest extends PageableRequest {
    private Integer id;

    private Integer role;

    private Account account;

    private String code;

    private String name;

    private MultipartFile image;

    private String detailedAddress;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;

    private String phoneNumber;

    private String gender;

    private String email;

    private String nationalId;

    private String status;

    private String note;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;
}
