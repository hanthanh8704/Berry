package com.example.be.dto.admin.response.address;

import com.example.be.entities.Address;
import com.example.be.entities.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Address.class, Customer.class})

public interface AddressResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getId();
    Integer getIdKhachHang();
    String getFullName();
    String getPhoneNumber();
    String getDistrict();

    String getCity();

    String getWard();
    Boolean getDefaultAddress();

    String getDetailedAddress();
    String getStatus();
    Integer getCustomer();
    String getCreatedBy();
    String getUpdatedBy();
    Boolean getDeleted();
}

