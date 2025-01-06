package com.example.be.dto.admin.response.bill;

import com.example.be.entities.Bill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

/**
 * @author thangdt
 */
@Projection(types = {Bill.class})
public interface UserBillResponse {

    @Value("#{target.stt}")
    String getStt();

    @Value("#{target.id}")
    String getId();

    @Value("#{target.userName}")
    String getUserName();
}
