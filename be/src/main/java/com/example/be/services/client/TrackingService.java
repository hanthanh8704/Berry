package com.example.be.services.client;

import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.dto.admin.request.bill.CancelBillClientRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TrackingService {
    Bill findByMaAndSDT(String ma, String sdt);

    BillRequestClient detailHoaDon(String ma);

    Bill changeStatusCancelBill(Integer id, CancelBillClientRequest  request);

    //Nuts  thêm sản phẩm
    BillRequestClient selectedProductDetail(BillDetailRequest request , List<BillDetail> sanPhamCu);
    //Nuts  update lại số lượng của nó

    //Nút đặt hàng
    boolean reSetOrder(BillRequest request , List<BillDetail> sanPhamMoi);
    Bill updateDiaChi(BillRequest request);
}
