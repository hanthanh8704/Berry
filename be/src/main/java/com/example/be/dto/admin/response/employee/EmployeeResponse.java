package com.example.be.dto.admin.response.employee;

import com.example.be.entities.Employee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;
import java.util.Date;

@Projection(types = {Employee.class})
public interface EmployeeResponse {
    @Value("#{target.indexs}")
    Integer getInteger();
    String getId();
    String getImage();
    String getCode();
    String getName();
    String getDetailedAddress();
    Date getDateOfBirth();
    String getPhoneNumber();
    String getEmail();
    String getNationalId();
    String getGender();
    String getStatus();
    String getNote();
    Timestamp getCreatedAt();
    Timestamp getUpdatedAt();

    Boolean getDeleted();
}
