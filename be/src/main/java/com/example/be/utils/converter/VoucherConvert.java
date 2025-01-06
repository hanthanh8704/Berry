package com.example.be.utils.converter;


import com.example.be.dto.admin.request.voucher.VoucherRequest;
import com.example.be.entities.Voucher;
import com.example.be.repositories.admin.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoucherConvert {
    @Autowired
    private VoucherRepository voucherRepository;
    private String genCode() {
        String prefix = "VC0";
        int x = 1;
        String code = prefix + x;
        while (voucherRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }
    public Voucher converRequestToEntity(VoucherRequest request){
//        if (request.getMa() == null) {
//            request.setMa(genCode());
//        }
        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .quantity(request.getQuantity()!= null ? request.getQuantity() : 1)
                .type(request.getType())
                .discountMethod(request.getDiscountMethod())
                .discountValue((request.getDiscountValue()))
                .minOrderValue((request.getMinOrderValue()))
                .maxDiscountValue((request.getMaxDiscountValue()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .deleted(request.getDeleted())
                .createdBy("admin")
                .updatedBy("admin")
                .build();
    }


    public Voucher convertRequestToEntity(Integer id, VoucherRequest request){
        Voucher voucher = voucherRepository.findById(id).get();
//        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setType(request.getType());
        voucher.setDiscountMethod(request.getDiscountMethod());
        voucher.setQuantity(request.getQuantity()!= null ? request.getQuantity() : 1);
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscountValue(request.getMaxDiscountValue());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setCreatedBy("admin");
        voucher.setUpdatedBy("admin");
        return voucher;
    }
}
