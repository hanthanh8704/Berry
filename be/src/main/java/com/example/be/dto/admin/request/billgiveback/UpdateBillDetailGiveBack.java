package com.example.be.dto.admin.request.billgiveback;
import com.example.be.utils.constant.StatusReturnOrder;
import lombok.*;

import java.math.BigDecimal;
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBillDetailGiveBack {
    private Integer idBillDetail;

    private Integer idProductDetail;

    private BigDecimal price;

    private Integer promotion;

    private int quantity;

    private BigDecimal totalPrice;
    private int quantityLoi;
    private int quantityNham;
    private StatusReturnOrder status;
}

