package com.poly.backend.dto.request.trahang;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TraHangRequest {

    private Integer id;

    private Integer employeeId;

    private Integer billId;

    private List<Integer> idSpct;

    private List<Integer> quantity;

    private List<BigDecimal> price;

    private List<BigDecimal> totalMoney;
    private String note;

    private LocalDateTime paymentDate;

    private String status;
}
