package com.poly.backend.dto.request.diachi;

import com.poly.backend.entity.English.Customer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiaChiRequest {

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

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String createdBy;

    private String updatedBy;

    private Boolean deleted;


}
