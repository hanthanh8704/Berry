package com.example.be.utils.converter;


import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.entities.Address;
import com.example.be.repositories.admin.AddressRepository;
import com.example.be.repositories.admin.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AddressConvert {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private CustomerRepository customerRepository;

    public Address convertRequestToEntity(AddressRequest request) {
        return Address.builder()
                .customer(request.getIdKhachHang() != null ? customerRepository.findById(request.getIdKhachHang()).orElse(null) : null)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .defaultAddress(request.getDefaultAddress())
                .detailedAddress(request.getDetailedAddress())
                .status(request.getStatus())
                .updatedBy(request.getUpdatedBy())
                .build();
    }
    public Address convertRequestToEntity(Integer id, AddressRequest request) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Địa chỉ với id: " + id));
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setDefaultAddress(request.getDefaultAddress());
        address.setDetailedAddress(request.getDetailedAddress());
        address.setStatus(request.getStatus());
        address.setUpdatedBy(request.getUpdatedBy());
        return address;
    }

}
