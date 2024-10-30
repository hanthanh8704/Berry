package com.example.be.services.impl;

import com.example.be.dto.admin.response.billhistory.BillHistoryResponse;
import com.example.be.entities.BillHistory;
import com.example.be.repositories.admin.BillHistoryRepository;
import com.example.be.services.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author hanthanh
 */
@Service
public class BillHistoryServiceImpl implements BillHistoryService {

    @Autowired
    private BillHistoryRepository billHistoryRepository;


    @Override
    public List<BillHistoryResponse> getByBill(Integer idBill) {
        return billHistoryRepository.getByBill(idBill);
    }
}
