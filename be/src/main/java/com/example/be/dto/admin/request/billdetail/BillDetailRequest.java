package com.example.be.dto.admin.request.billdetail;

import com.example.be.utils.common.PageableObject;
import com.example.be.utils.common.PageableRequest;
import com.example.be.utils.constant.StartusBillDetail;
import com.example.be.utils.constant.StatusBill;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * @author hanthanh
 */
@Getter
@Setter
@AllArgsConstructor
public class BillDetailRequest extends PageableRequest {

    private Integer id;

    private Integer quantity;
    private BigDecimal price;
    private Integer idBill;
    private Integer promotion;

    private Integer IdChiTietSanPham;

    private String detailCode;

    // Filter
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private StatusBill status;
    private Integer statusBill;
}
