package com.example.be.dto.admin.response.customer;

import com.example.be.dto.admin.request.account.AccountRequest;
import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.entities.Address;
import com.example.be.entities.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.util.Date;

/**
 * @author hanthanh
 */
@Projection(types = Customer.class)
public interface CustomerResponse {

    @Value("#{target.indexs}")
    Integer getInteger();
    Integer getId();

    String getEmail();

    String getImage();
    String getPhoneNumber();

    String getStatus();

    String getCreatedBy();

    String getUpdatedBy();

    Date getDateOfBirth();

    String getFullName();

    String getGender();

    String getCode();

    String getNote();

}
