package com.example.be.app.client_app.dto.response;

import java.math.BigDecimal;

public interface ClientMinMaxPrice {
    BigDecimal getMinPrice();

    BigDecimal getMaxPrice();
}
