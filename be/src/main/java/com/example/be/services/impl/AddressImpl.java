package com.example.be.services.impl;



import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.dto.admin.response.address.AddressResponse;
import com.example.be.entities.Address;
import com.example.be.entities.Customer;
import com.example.be.repositories.admin.AddressRepository;
import com.example.be.repositories.admin.CustomerRepository;
import com.example.be.services.AddressService;
import com.example.be.utils.converter.AddressConvert;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressImpl implements AddressService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private AddressConvert addressConvert;

    @Override
    public Page<AddressResponse> getByAccount(Integer id, AddressRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return addressRepository.getAddress(id, pageable);
    }

    private Customer getIdCustomerFromAddress(Integer idKhachHang) {
        return customerRepository.findById(idKhachHang)
                .orElseThrow(() -> new IllegalArgumentException("KhachHang with id " + idKhachHang + " not found"));
    }

    @Override
    public Address create(AddressRequest request) {
        // Print out information for debugging
        System.out.println("Attempting to create new address:");
        System.out.println("Dia chi cu the: " + request.getDetailedAddress());
        System.out.println("Phuong: " + request.getWard());
        System.out.println("Huyen: " + request.getDistrict());
        System.out.println("Thanh pho: " + request.getCity());
        System.out.println("Id KhachHang: " + request.getIdKhachHang());

        // Kiểm tra idKhachHang có tồn tại không
        if (request.getIdKhachHang() == null) {
            throw new RuntimeException("idKhachHang is required.");
        }

        // Kiểm tra xem KhachHang với id có tồn tại không
        Customer customer = customerRepository.findById(request.getIdKhachHang())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + request.getIdKhachHang()));

        // Tạo đối tượng Address từ AddressRequest
        Address entity = new Address();
        entity.setCustomer(customer);
        entity.setFullName(request.getFullName());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setCity(request.getCity());
        entity.setDistrict(request.getDistrict());
        entity.setWard(request.getWard());
        entity.setDefaultAddress(request.getDefaultAddress());
        entity.setDetailedAddress(request.getDetailedAddress());
        entity.setStatus(request.getStatus());
        entity.setUpdatedBy(request.getUpdatedBy());

        // Save the entity
        Address savedAddress = addressRepository.save(entity);

        // Print out success message
        System.out.println("Address created successfully: " + savedAddress);

        return savedAddress;
    }




    @Override
    public Address update(Integer id, AddressRequest request) {
        // Tìm địa chỉ cần sửa theo id
        Address diaChiToUpdate = addressRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Không tìm thấy địa chỉ với id: " + id));

        // Cập nhật thông tin của địa chỉ từ request
        if (request.getIdKhachHang() != null) {
            Customer customer = customerRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new RestApiException("Không tìm thấy KhachHang với id: " + request.getIdKhachHang()));
            diaChiToUpdate.setCustomer(customer);
            System.out.println("ID Khach hang: " + request.getIdKhachHang());
        }
        diaChiToUpdate.setFullName(request.getFullName());
        System.out.println("Ho ten: " + request.getFullName());
        diaChiToUpdate.setPhoneNumber(request.getPhoneNumber());
        System.out.println("SDT :" + request.getPhoneNumber());
        diaChiToUpdate.setCity(request.getCity());
        System.out.println("Thanh pho: " + request.getCity());
        diaChiToUpdate.setDistrict(request.getDistrict());
        System.out.println("Huyen: " + request.getDistrict());
        diaChiToUpdate.setWard(request.getWard());
        System.out.println("Phuong: " + request.getWard());
        diaChiToUpdate.setDefaultAddress(request.getDefaultAddress());
        System.out.println("Dia chi mac dinh: " + request.getDefaultAddress());
        diaChiToUpdate.setDetailedAddress(request.getDetailedAddress());
        System.out.println("Dia chi cu the: " + request.getDetailedAddress());
        diaChiToUpdate.setStatus(request.getStatus());
        System.out.println("Trang thai: " + request.getStatus());
        diaChiToUpdate.setCreatedBy(request.getCreatedBy());
        System.out.println("Nguoi tao: " + request.getCreatedBy());
        diaChiToUpdate.setUpdatedBy(request.getUpdatedBy());
        System.out.println("Nguoi sua: " + request.getUpdatedBy());

        // Lưu và trả về đối tượng đã được cập nhật
        return addressRepository.save(diaChiToUpdate);
    }


    @Override
    public Address delete(Integer id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Không tìm thấy địa chỉ"));

        // Kiểm tra số lượng địa chỉ của khách hàng chưa bị xóa
        List<Address> diaChiList = addressRepository.findAllByIdCustomerAndDeletedFalse(address.getCustomer().getId());
        if (diaChiList.size() > 1) {
            addressRepository.delete(address);
            System.out.println("Xóa thành công"); // Optional: Log success
            return address; // Return the deleted address
        } else {
            throw new RestApiException("Không thể xóa địa chỉ này!");
        }
    }

}
