package com.example.be.dto.client.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressRequestClient {
    private Integer id;

    //    private Customer customer;
    private Integer customerId;

    private String fullName;

    private String phoneNumber;

    private Boolean defaultAddress;

    private String city;

    private String district;

    private String ward;

    private String detailedAddress;

    private String status;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;

}
