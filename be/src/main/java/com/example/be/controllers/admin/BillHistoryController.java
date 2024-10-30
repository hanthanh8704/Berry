package com.example.be.controllers.admin;

import com.example.be.dto.admin.response.billhistory.BillHistoryResponse;
import com.example.be.services.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("api/bill-history")
public class BillHistoryController {
    @Autowired
    private BillHistoryService billHistoryService;

    @GetMapping("/{idHoaDon}")
    public List<BillHistoryResponse> getByBill(@PathVariable("idHoaDon") Integer id){
        return billHistoryService.getByBill(id);
    }

}
