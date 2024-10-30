package com.example.be.dto.admin.response.voucher;

import com.example.be.entities.Voucher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;
/**
 * @author ninhncph40535
 *
 */

@Projection(types = {Voucher.class})
public interface VoucherResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Integer getId();
    String getCode();
    String getName();
    String getType();
    Integer getQuantity();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    String getStatus();
    String getDiscountMethod();
    BigDecimal getDiscountValue();
    BigDecimal getMinOrderValue();
    BigDecimal getMaxDiscountValue();
    String getCustomers();

}
