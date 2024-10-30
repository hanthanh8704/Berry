package com.example.be.services;


import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.*;
import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import com.example.be.utils.common.PageableObject;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hanthanh
 */
public interface BillService {

    PageableObject<BillResponse> getAll(BillSearchRequest request);

    List<CountBillStatus> getHoaDonByTrangThai();

    List<Bill> getNewHoaDon(BillSearchRequest request);

    Bill findByMa(String ma);

    Bill getOne(Integer id);

    Bill create();

    Bill orderBill(Integer id,BillRequest request);

    Bill changeStatus(Integer id, String ghiChu, String trangThai);

    Bill changeInfoCustomer(Long id, BillRequest request);

    boolean changeStatus(ChangAllStatusBillByIdsRequest request, Integer idNhanVien);

    Bill changeStatusCancelBill(Integer id, Integer idEmployees, CancelBillClientRequest request);

    Bill rollBackBill(Integer idHD, Integer idNV, ChangStatusBillRequest request);

    //Hàm thay đổi thông tin khách hàng trong hóa đơn

    //Hàm lấy ra thông tin địa chỉ và địa chi mặc định của khách hàng
    ChangeCustomerRequest detailInfoCustomer(Integer idBill);
    Bill changeInfoCustomer(Integer idHD, BillRequest request , Integer idNV);
    //Hàm lấy ra tất cả nhân viên
    List<Employee> getAllEmployee();
    //Hàm thay đổi nhaan vieen tieeps nhan trong hóa đơn
    boolean changeEmployee(Integer idNV ,ChangeEmployeeRequest request);
    boolean updateBillWait(BillRequest request);
    String createAllFilePdf(ChangAllStatusBillByIdsRequest request);
    String createFilePdfAtCounter(String idBill, BigDecimal totalExcessMoney);
}
