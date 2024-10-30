package com.example.be.dto.client.request;

import com.example.be.entities.Account;
import com.example.be.entities.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRequestClient {
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

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;
    private Boolean deleted;

    private Account account;

    private List<Address> listAddress;
}
