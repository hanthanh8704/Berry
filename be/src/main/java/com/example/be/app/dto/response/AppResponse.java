package com.example.be.app.dto.response;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AppResponse {
    String getIdStaff();
    String getIdBill();
}
