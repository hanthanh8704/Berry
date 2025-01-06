package com.example.be.dto.client.request;

import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.entities.BillDetail;
import lombok.Data;

import java.util.List;

@Data
public class SelectedProductRequest {
    private BillDetailRequest billDetailRequest;
    private List<BillDetail> sanPhamMoi;
    private BillRequest billRequest;
}
