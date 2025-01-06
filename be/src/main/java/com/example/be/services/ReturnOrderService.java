package com.example.be.services;

import com.example.be.dto.admin.request.billgiveback.ChangAllStatusBillGiveBackIdsRequest;
import com.example.be.dto.admin.request.billgiveback.UpdateBillDetailGiveBack;
import com.example.be.dto.admin.request.billgiveback.UpdateBillGiveBack;
import com.example.be.dto.admin.response.bill.BillGiveBack;
import com.example.be.dto.admin.response.bill.BillGiveBackInformation;
import com.example.be.entities.Bill;
import com.example.be.entities.ReturnOrder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReturnOrderService {
    BillGiveBackInformation getBillGiveBackInformation(String codeBill);

    //Hàm này lấy danh sách các bản ghi hoặc chi tiết của hóa đơn trả hàng dựa trên ID của hóa đơn (idBill).
    List<BillGiveBack> getBillGiveBack(Integer idBill);

    //Hàm này cập nhật hóa đơn trả hàng với các chi tiết liên quan.
    Bill updateBillGiveBack(Integer idEmployee, UpdateBillGiveBack updateBillGiveBack, List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks);
    //    // Hàm này dùng để gửi email về quy trình trả hàng,
//     byte[] generateReturnOrderPDF(Bill bill, List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks);
    String createAllFilePdf(ChangAllStatusBillGiveBackIdsRequest request);
    ReturnOrder findByIdBill(Integer idBill);

}
