package com.example.be.dto.admin.request.voucher;


import com.example.be.utils.common.PageableRequest;
import com.example.be.utils.constant.MethodVoucher;
import com.example.be.utils.constant.VoucherConstant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest extends PageableRequest {
    private Integer id;
    private String code;

    private String name;

    private Integer quantity;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime endDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp createdAt;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp updatedAt;

    private String status;

    private BigDecimal minOrderValue;
    private BigDecimal maxDiscountValue;

    private BigDecimal discountValue;

    private MethodVoucher discountMethod;

    private VoucherConstant type;
    private String findType;

    private String createdBy;

    private String updatedBy;
    private List<Integer> customers;
    private Boolean deleted;

    public List<Integer> getCustomers() {
        return customers != null ? customers : Collections.emptyList();
    }
}