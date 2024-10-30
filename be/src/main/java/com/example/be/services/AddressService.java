package com.example.be.services;

import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.dto.admin.response.address.AddressResponse;
import com.example.be.entities.Address;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface AddressService {
    Page<AddressResponse> getByAccount(Integer id, AddressRequest request);

    Address create(AddressRequest request);

    Address update(Integer idAddress, AddressRequest request);

    Address delete(Integer idAddress);

}

