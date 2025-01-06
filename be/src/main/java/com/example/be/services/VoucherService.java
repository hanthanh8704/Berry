package com.example.be.services;


import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.request.voucher.VoucherRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.dto.admin.response.voucher.VoucherResponse;
import com.example.be.entities.Voucher;
import com.example.be.entities.VoucherCustomer;
import com.example.be.utils.common.PageableObject;

import java.util.List;


public interface VoucherService {
    List<VoucherResponse> getAccountVoucher(Integer id, VoucherRequest request);
    List<VoucherResponse> getPublicVoucher(VoucherRequest request);

    List<VoucherCustomer> getFind(Integer id);
    PageableObject<VoucherResponse> getAll(VoucherRequest request);
    VoucherResponse getOne(Integer id);


    Voucher add(VoucherRequest voucher);

    Voucher update(Integer id, VoucherRequest voucher);

    String delete(Integer id);

    boolean isVoucherCodeExists(String code);

    void updateStatusVoucher();

    Voucher updateEndDate(Integer id);
    Voucher updateStartStatus(Integer id);
    PageableObject<CustomerResponse> findCustomer(CustomerRequest request);
    PageableObject<CustomerResponse> findVoucherCustomer(Integer id,CustomerRequest request);
}
