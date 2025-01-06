package com.example.be.dto.admin.response.payment;


import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import com.example.be.utils.constant.StatusMethod;
import com.example.be.utils.constant.StatusPayMents;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface PaymentResponse {
    //ninh cute pho mai que
    Integer getId(); // Lấy ID của giao dịch thanh toán

    Integer getIdBill(); // Lấy đối tượng Bill liên quan

    Integer getEmployeeId(); // Lấy đối tượng Employee liên quan

    StatusMethod getMethod(); // Lấy phương thức thanh toán

    String getTransactionNo(); // Lấy số giao dịch

    Timestamp getTransactionDate(); // Lấy ngày giờ giao dịch

    BigDecimal getTotalMoney(); // Lấy tổng số tiền

    String getStatus(); // Lấy trạng thái thanh toán

    Timestamp getCreatedAt(); // Lấy thời gian tạo
    String getNameEmployee();

    Timestamp getUpdatedAt(); // Lấy thời gian cập nhật
}
