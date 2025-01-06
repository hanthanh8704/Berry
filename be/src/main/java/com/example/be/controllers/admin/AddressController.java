package com.example.be.controllers.admin;


import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.dto.admin.response.address.AddressResponse;
import com.example.be.entities.Address;
import com.example.be.services.AddressService;
import com.example.be.utils.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/address")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @GetMapping("/default/{idkh}")
    public Address getByAccount1(@PathVariable("idkh") Integer id) {
        return addressService.getByAccountid(id);
    }

    @GetMapping("/{idkh}")
    public Page<AddressResponse> getByAccount(@PathVariable("idkh") Integer id, AddressRequest request) {
        return addressService.getByAccount(id, request);
    }

    @PostMapping
    public ResponseObject create(@RequestBody AddressRequest request) {
        return new ResponseObject(addressService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable("id") Integer id, @RequestBody AddressRequest request) {
        return new ResponseObject(addressService.update(id, request));
    }
    @PutMapping("/address/{id}")
    public ResponseObject updateAddress(@PathVariable("id") Integer id, @RequestBody AddressRequest request) {
        return new ResponseObject(addressService.updateAddress(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable("id") Integer id) {
        return new ResponseObject(addressService.delete(id));
    }

}

