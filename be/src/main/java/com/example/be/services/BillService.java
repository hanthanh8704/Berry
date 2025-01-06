package com.example.be.services;


import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.*;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.Customer;
import com.example.be.entities.Employee;
import com.example.be.utils.common.PageableObject;
import jakarta.servlet.http.HttpServletRequest;

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

    Bill create( BillRequest request);
//
//    Bill orderBill(Integer id,BillRequest request);
// Bill create();

    Bill orderBill(Integer id,BillRequest request);

    boolean changeQuantity(Integer id , Integer nv );

    Bill changeInfoCustomer(Long id, BillRequest request);

    boolean changeStatus(ChangAllStatusBillByIdsRequest request, Integer idNhanVien);

    Bill changeStatusCancelBill(Integer id, Integer idEmployees, CancelBillClientRequest request);
    boolean createTemplateSendMail(Integer idBill, BigDecimal totalExcessMoney);
    boolean createTemplateSendMailClient(Integer idBill, BigDecimal totalExcessMoney);
    Bill rollBackBill(Integer idHD, Integer idNV, ChangStatusBillRequest request);

    //Hàm thay đổi thông tin khách hàng trong hóa đơn

    //Hàm lấy ra thông tin địa chỉ và địa chi mặc định của khách hàng
    ChangeCustomerRequest detailInfoCustomer(Integer idBill);
    Bill deleted(Integer id);
    Bill changeInfoCustomer(Integer idHD, Integer idNV, BillRequest request);
    //Hàm lấy ra tất cả nhân viên
    List<Employee> getAllEmployee();
    //Hàm thay đổi nhaan vieen tieeps nhan trong hóa đơn
    boolean changeEmployee(Integer idNV ,ChangeEmployeeRequest request);
    boolean updateBillWait(BillRequest request);
    String createAllFilePdf(ChangAllStatusBillByIdsRequest request);
    String createFilePdfAtCounter(String idBill, BigDecimal totalExcessMoney);

    PageableObject<BillResponse> getAllDonYeuCauHuy(BillSearchRequest request);

    boolean createFilePdfAtCounter(Integer idBill);
}
