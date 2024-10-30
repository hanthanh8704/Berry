package com.example.be.services.impl;


import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.BillResponse;
import com.example.be.dto.admin.response.bill.InvoiceResponse;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.services.BillService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.*;
import com.example.be.utils.converter.BillConvert;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.exportPdf.ExportFilePdfFormHtml;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author hanthanh
 */

@Service
@Transactional
public class BillServiceImpl implements BillService {
    private final BillRepository hoaDonRepository;
    private final BillConvert billConvert;
    private final BillDetailRepository hoaDonChiTietRepository;
    private final BillHistoryRepository lichSuHoaDonRepository;
    private final EmployeeRepository nhanVienRepository;
    private final PaymentRepository thanhToanRespository;

    private final VoucherRepository phieuGiamGiaRepository;

    @Autowired
    private ExportFilePdfFormHtml exportFilePdfFormHtml;

    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    public BillServiceImpl(BillRepository hoaDonRepository, BillConvert billConvert, BillDetailRepository hoaDonChiTietRepository, BillHistoryRepository lichSuHoaDonRepository, EmployeeRepository nhanVienRepository, PaymentRepository thanhToanRespository, VoucherRepository phieuGiamGiaRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.billConvert = billConvert;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.thanhToanRespository = thanhToanRespository;
        this.phieuGiamGiaRepository = phieuGiamGiaRepository;
    }


    // Gen mã
    private String genBillCode() {
        String prefix = "HD00";
        int x = 1;
        String ma = prefix + x;
        while (hoaDonRepository.existsByCode(ma)) {
            x++;
            ma = prefix + x;
        }
        return ma;
    }

    @Override
    public PageableObject<BillResponse> getAll(BillSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonRepository.getAllHoaDon(request, pageable));
    }

    @Override
    public List<CountBillStatus> getHoaDonByTrangThai() {
        return hoaDonRepository.getHoaDonByTrangThai();
    }

    @Override
    public List<Bill> getNewHoaDon(BillSearchRequest request) {
        return hoaDonRepository.getNewBill(request);
    }

    @Override
    public Bill findByMa(String ma) {
        return hoaDonRepository.findByCode1(ma);
    }

    @Override
    public Bill getOne(Integer id) {
        Optional<Bill> bill = hoaDonRepository.findById(id);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        return bill.get();
    }

    // Hàm này dùng để tạo 1 hóa đơn bán hàng tại quầy
    @Override
    public Bill create() {
        Bill hd = new Bill();
        BillHistory lshd = new BillHistory();
        hd.setEmployee(nhanVienRepository.findById(1).orElse(null));
        hd.setInvoiceStatus(StatusBill.TAO_HOA_DON);
        hd.setCode(genBillCode());
        hd.setInvoiceType(TypeBill.TAI_QUAY);
        Bill saveHD = hoaDonRepository.save(hd);
        lshd.setBill(saveHD);
        lshd.setEmployee(saveHD.getEmployee());
        lshd.setActionDescription("Tạo đơn hàng");
        lshd.setStatus(StatusBill.TAO_HOA_DON);
        lichSuHoaDonRepository.save(lshd);
        return null;
    }
    @Override
    public Bill orderBill(Integer id, BillRequest request) {
        if (request.getVoucherId() != null) {
            Voucher phieuGiamGia = phieuGiamGiaRepository.findById(request.getVoucherId()).get();
            phieuGiamGia.setQuantity(phieuGiamGia.getQuantity() - 1);
            phieuGiamGiaRepository.save(phieuGiamGia);
        }

        BillHistory lichSuHoaDon = new BillHistory();
        Payment thanhToan = new Payment();
        Bill hoaDon = billConvert.convertRequestToEntity(hoaDonRepository.findById(id).get(), request);
        lichSuHoaDon.setBill(hoaDon);
        thanhToan.setBill(hoaDon);
        thanhToan.setMethod(StatusMethod.TIEN_MAT);

        if (request.getChoThanhToan()) {
            hoaDon.setInvoiceStatus(StatusBill.CHO_XAC_NHAN);
            lichSuHoaDon.setStatus(StatusBill.CHO_XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon);
            hoaDonRepository.save(hoaDon);
            return hoaDon;
        }

        if ("TAI_QUAY".equals(request.getInvoiceType())) {
            hoaDon.setInvoiceStatus(StatusBill.THANH_CONG);
            hoaDon.setReceivedDate(new Timestamp(System.currentTimeMillis()));
//            LichSuHoaDon lshd = new LichSuHoaDon();
//            lshd.setHoaDon(hoaDon);
//            lshd.setGhiChu(BillStatusConstant.DA_XAC_NHAN);
//            lshd.setTrangThai(BillStatusConstant.DA_XAC_NHAN);
//            lichSuHoaDonRepository.save(lshd);
        }

        if (ThanhToanEnum.TIEN_MAT.equals(request.getHinhThucThanhToan())) {
            thanhToan.setTotalMoney(hoaDon.getTotalMoney());
            thanhToan.setMethod(StatusMethod.TIEN_MAT);
            thanhToanRespository.save(thanhToan);
        } else if (ThanhToanEnum.CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
            thanhToan.setTotalMoney(hoaDon.getTotalMoney());
            thanhToan.setMethod(StatusMethod.CHUYEN_KHOAN);
            thanhToanRespository.save(thanhToan);
        }
//        else if (ThanhToanEnum.TIEN_MAT_VA_CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
//            Payment tt = new Payment();
//            tt.setBill(hoaDon);
//            tt.setTotalMoney(request.getTienMat());
//
//            tt.setMethod(StatusMethod.TIEN_MAT);
//            thanhToanRespository.save(tt);
//            tt.setTotalMoney(request.getTienChuyenKhoan());
//            tt.setTransactionNo(request.getTransactionNo());
//            tt.setMethod(StatusMethod.CHUYEN_KHOAN);
//            thanhToanRespository.save(tt);
//        }

        lichSuHoaDon.setActionDescription("Mua hàng thành công");
        lichSuHoaDon.setStatus(StatusBill.THANH_CONG);


        if ("TRUC_TUYEN".equals(request.getInvoiceType())) {
            hoaDon.setInvoiceStatus(StatusBill.CHO_XAC_NHAN);
            lichSuHoaDon.setStatus(StatusBill.CHO_XAC_NHAN);
//            lichSuHoaDon.setGhiChu(BillStatusConstant.CHO_GIAO_HANG);

            if (ThanhToanEnum.CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
                BillHistory lshd = new BillHistory();
                lshd.setBill(hoaDon);
//                lshd.setGhiChu("Đã xác nhận thông tin thanh toán!");
                lichSuHoaDon.setStatus(StatusBill.CHO_VAN_CHUYEN);
                lichSuHoaDonRepository.save(lshd);
                thanhToan.setStatus(StatusPayMents.THANH_TOAN);
//                thanhToan.setGhiChu("Đã chuyển khoản!");
                thanhToan.setTransactionNo(request.getTransactionNo());
                thanhToan.setMethod(StatusMethod.CHUYEN_KHOAN);
                thanhToanRespository.save(thanhToan);
            } else if (ThanhToanEnum.TIEN_MAT_VA_CHUYEN_KHOAN.equals(request.getHinhThucThanhToan())) {
                thanhToan.setTotalMoney(request.getTienChuyenKhoan());
//                thanhToan.s("Đã chuyển khoản!");
                thanhToan.setTransactionNo(request.getTransactionNo());
                thanhToan.setMethod(StatusMethod.CHUYEN_KHOAN);
                thanhToanRespository.save(thanhToan);
            }
        }

        lichSuHoaDonRepository.save(lichSuHoaDon);
        hoaDonRepository.save(hoaDon);
        return hoaDon;
    }

    @Override
    public Bill changeStatus(Integer id, String ghiChu, String trangThai) {
        return null;
    }

    @Override
    public Bill changeInfoCustomer(Long id, BillRequest request) {
        return null;
    }
    public boolean changeStatus(ChangAllStatusBillByIdsRequest request, Integer idNhanVien) {
        ZonedDateTime vietnamTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        if (request.getIdHD() == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }

        Optional<Bill> bill = hoaDonRepository.findById(request.getIdHD());
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        //Đây là nhân viên đang nhập vào
        Optional<Employee> employee = Optional.empty();
        if (idNhanVien != null) {
            employee = nhanVienRepository.findById(idNhanVien);
            if (!employee.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }
        }

        // Kiểm tra xem hóa đơn đã thanh toán chưa
        boolean checkDaThanhToan = lichSuHoaDonRepository.findAllByBill(bill.get()).stream()
                .anyMatch(invoice -> invoice.getStatus() == StatusBill.DA_THANH_TOAN);

        bill.get().setInvoiceStatus(StatusBill.valueOf(request.getStatus()));

        // Nếu trạng thái của hóa đơn là xác nhận thì gửi mail cho khách hàng
        if (bill.get().getInvoiceStatus() == StatusBill.XAC_NHAN) {
            bill.get().setConfirmationDate(Timestamp.valueOf(LocalDateTime.now()));
            // Gửi mail nếu cần thiết
        } else if (bill.get().getInvoiceStatus() == StatusBill.CHO_XAC_NHAN ||
                bill.get().getInvoiceStatus() == StatusBill.VAN_CHUYEN ||
                bill.get().getInvoiceStatus() == StatusBill.DA_THANH_TOAN) {
            bill.get().setConfirmationDate(Timestamp.valueOf(LocalDateTime.now()));
            if (bill.get().getInvoiceStatus() == StatusBill.DA_THANH_TOAN && checkDaThanhToan) {
                bill.get().setInvoiceStatus(StatusBill.THANH_CONG);
                bill.get().setConfirmationDate(Timestamp.valueOf(vietnamTime.toLocalDateTime()));
            }
        } else if (bill.get().getInvoiceStatus() == StatusBill.THANH_CONG) {
            thanhToanRespository.updateAllByIdBill(request.getIdHD());
            bill.get().setConfirmationDate(Timestamp.valueOf(vietnamTime.toLocalDateTime()));
        }

        // Cập nhật thời gian
        bill.get().setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        // Chỉ set employee nếu idNhanVien không phải là null
        if (idNhanVien != null) {
            bill.get().setEmployee(employee.get());
        } else {
            bill.get().setEmployee(null); // Nếu là đơn hàng online thì set employee là null
        }


        // Lưu lịch sử hóa đơn
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatus(bill.get().getInvoiceStatus());

        // Chỉ set employee nếu idNhanVien không phải là null
        billHistory.setEmployee(employee.get());
        billHistory.setActionDescription(request.getNote());
        lichSuHoaDonRepository.save(billHistory);
        hoaDonRepository.save(bill.get());

        return true;
    }


    //Hàm của Đức làm
    @Override
    public Bill changeStatusCancelBill(Integer id, Integer idEmployees, CancelBillClientRequest request) {
        Optional<Bill> bill = hoaDonRepository.findById(id);
        //Đây là nhân viên đang nhập
        Optional<Employee> employee = nhanVienRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!employee.isPresent()) {
//            throw new RestApiException(Message.ACCOUNT_IS_EXIT);
        }
        //        employee.get().getAccount().getRole().getName() != Roles.ADMIN
        //Ko phải admin ko được hủy
        if (!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN) && !!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
            throw new RestApiException("Bạn không có quyền được đổi");
//            throw new RestApiException(Message.ACCOUNT_NOT_ROLE_CANCEL_BILL);
        }

        if (bill.get().getInvoiceStatus() == StatusBill.VAN_CHUYEN && !employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
            throw new RestApiException("Bạn không có quyền được đổi");
//            throw new RestApiException(Message.ACCOUNT_NOT_ROLE_CANCEL_BILL);
        }
        bill.get().setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        bill.get().setInvoiceStatus(StatusBill.DA_HUY);
        bill.get().setEmployee(employee.get());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatus(bill.get().getInvoiceStatus());
        billHistory.setActionDescription(request.getDescription());
        billHistory.setEmployee(employee.get());
        lichSuHoaDonRepository.save(billHistory);

        List<BillDetail> billDetailResponse = hoaDonChiTietRepository
                .findAllByIdBill(bill.get().getId());

        billDetailResponse.forEach(item -> {
            Optional<ProductDetail> productDetail = productDetailRepository.findById(item.getProductDetail().getId());
            if (!productDetail.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }

            productDetail.get().setQuantity(item.getQuantity() + productDetail.get().getQuantity());
            if (productDetail.get().getStatus() == Status.HET_SAN_PHAM) {
                productDetail.get().setStatus(Status.DANG_SU_DUNG);
            }
            productDetailRepository.save(productDetail.get());
        });

        return hoaDonRepository.save(bill.get());
    }

    @Override
    public Bill rollBackBill(Integer idHD, Integer idNV, ChangStatusBillRequest request) {

        Optional<Bill> bill = hoaDonRepository.findById(idHD);
        //Đây là nhân viên đang nhập
        Optional<Employee> employee = nhanVienRepository.findById(idNV);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!employee.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }
        StatusBill statusBill[] = StatusBill.values();
        //trả về dữ liệu cho hóa đơn nếu nó là 2 thì sẽ trả về 1
        int nextIndex = (bill.get().getInvoiceStatus().ordinal() - 1) % statusBill.length;

        // Lấy và sắp xếp lịch sử của hóa đơn theo thời gian.
        List<BillHistory> billHistories = lichSuHoaDonRepository.findAllByBill(bill.get()).stream()
                .sorted(Comparator.comparing(BillHistory::getCreatedAt))
                .collect(Collectors.toList());

        //Kiểm tra xem lịch sử của hóa đơn đó đã thanh toán chuaa
        boolean checkDaThanhToan = billHistories.stream()
                .anyMatch(invoice -> invoice.getStatus() == StatusBill.DA_THANH_TOAN);

        if (nextIndex < 1) {
            throw new RestApiException(Message.CHANGED_STATUS_ERROR);
        }
        if (bill.get().getInvoiceStatus() == StatusBill.THANH_CONG) {

            Timestamp confirmedTimestamp = bill.get().getConfirmationDate();
            LocalDateTime confirmedDateTime = confirmedTimestamp.toLocalDateTime(); // Chuyển đổi trực tiếp từ Timestamp
            LocalDate currentDate = LocalDate.now();

            if (currentDate.isAfter(confirmedDateTime.toLocalDate().plusDays(1))) {
                throw new RestApiException("Đơn hàng đã quá 24h");
//                throw new RestApiException(Message.ERROR_ROLLBACK); // Ném ngoại lệ nếu đã quá 24 giờ
            }

        }
        if (checkDaThanhToan && bill.get().getInvoiceStatus() == StatusBill.THANH_CONG) {
            bill.get().setInvoiceStatus(StatusBill.VAN_CHUYEN);
            // Khôi phục trạng thái của hóa đơn về trạng thái trước đó nếu hóa đơn đã bị hủy và có đủ lịch sử.
        } else if (billHistories.size() > 3 && bill.get().getInvoiceStatus() == StatusBill.DA_HUY) {
            bill.get().setInvoiceStatus(billHistories.get(billHistories.size() - 2).getStatus());
            //Chỉ cho phép khôi phục trạng thái của hóa đơn từ "Đã hủy" sang "Chờ xác nhận"
        } else if (billHistories.size() <= 3 && bill.get().getInvoiceStatus() == StatusBill.DA_HUY) {
            // Có ít nhất một bản ghi lịch sử là "Xác nhận" hoặc "Đã thanh toán".
            if (billHistories.stream()
                    .anyMatch(invoice -> invoice.getStatus() == StatusBill.XAC_NHAN)
                    || billHistories.stream()
                    .anyMatch(invoice -> invoice.getStatus() == StatusBill.DA_THANH_TOAN)) {
                bill.get().setInvoiceStatus(StatusBill.CHO_XAC_NHAN);
            } else {
                throw new RestApiException(Message.CHANGED_STATUS_ERROR);
            }
        } else {
            // Cập nhật trạng thái của hóa đơn thành một trạng thái mới trong mảng statusBill dựa trên chỉ số nextIndex.
            bill.get().setInvoiceStatus(StatusBill.valueOf(statusBill[nextIndex].name()));
        }

        bill.get().setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        bill.get().setEmployee(employee.get());
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill.get());
        billHistory.setStatus(bill.get().getInvoiceStatus());
        billHistory.setActionDescription(request.getActionDescription());
        billHistory.setEmployee(employee.get());
        lichSuHoaDonRepository.save(billHistory);
        return hoaDonRepository.save(bill.get());
    }

    @Override
    public ChangeCustomerRequest detailInfoCustomer(Integer idBill) {
        Bill bill = hoaDonRepository.findById(idBill).orElseThrow(() -> new RestApiException("Hóa đơn không tồn tại"));
        ChangeCustomerRequest changeCustomerRequest = new ChangeCustomerRequest();

        if (bill.getCustomer() == null) {
            // Nếu khách hàng không tồn tại, gán các giá trị bằng null
            changeCustomerRequest.setAddress(null);
            changeCustomerRequest.setFullName(null);
            changeCustomerRequest.setPhoneNumber(null);
            changeCustomerRequest.setNote(bill.getNote());
        } else {
            // Nếu khách hàng tồn tại, tiếp tục xử lý
            Customer customer = bill.getCustomer();
            Address address = addressRepository.findByIdKhAndDefaultAddress(customer.getId());

            changeCustomerRequest.setAddress(address);
            changeCustomerRequest.setShippingFee(bill.getShippingFee());
            changeCustomerRequest.setFullName(bill.getRecipientName());
            changeCustomerRequest.setPhoneNumber(bill.getRecipientPhone());
            changeCustomerRequest.setNote(bill.getNote());
        }

        return changeCustomerRequest;
    }


    @Override
    public Bill changeInfoCustomer(Integer idHD, BillRequest request, Integer idNV) {
        //lẤY RA NHÂN VIÊN đang nhập
        Optional<Employee> employee = nhanVienRepository.findById(idNV);
        //Ban phai là admin mới được thay đổi ko cút
        if (!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
            throw new RestApiException("Bạn không có quyền được đổi, vai trò hiện tại: " + employee.get().getAccount().getRole().getName());
        }

        // Lấy hóa đơn theo idHD
        Bill bill = hoaDonRepository.findById(idHD).get();

        // Lấy thông tin khách hàng từ hóa đơn
        Customer customer = customerRepository.findById(bill.getCustomer().getId()).get();

        // Cập nhật lại thông tin khách hàng vào hóa đơn
        bill.setCustomer(customer);
        // Cập nhật các thông tin người nhận như tên, số điện thoại và địa chỉ
        bill.setRecipientName(request.getRecipientName());
        bill.setRecipientPhone(request.getRecipientPhone());
        // Cập nhật địa chỉ bằng cách ghép các phần chi tiết lại
        bill.setAddress(request.getAddress());
        // Cập nhật ghi chú của hóa đơn
        bill.setNote(request.getNote());
        bill.setShippingFee(request.getShippingFee());
        bill.setUpdatedBy(employee.get().getCode());
        // Lưu lại hóa đơn với các thay đổi mới
        hoaDonRepository.save(bill);

        // Trả về hóa đơn đã được cập nhật
        return bill;
    }

    @Override
    public List<Employee> getAllEmployee() {
        return nhanVienRepository.findAll();
    }


    @Override
    public boolean changeEmployee(Integer idNV, ChangeEmployeeRequest request) {
        Optional<Employee> employee = nhanVienRepository.findById(idNV);
        //Ban phai là admin mới được thay đổi ko cút
        if (!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
            throw new RestApiException("Bạn không có quyền được đổi, vai trò hiện tại: " + employee.get().getAccount().getRole().getName());
        }

        Optional<Bill> bill = hoaDonRepository.findById(request.getIdHD());

        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!employee.isPresent()) {
            throw new RestApiException(Message.NOT_EXISTS);
        }

        bill.get().setEmployee(employee.get());
        bill.get().setUpdatedBy(employee.get().getCode());
        hoaDonRepository.save(bill.get());
        return true;
    }

    @Transactional
    @Override
    public boolean updateBillWait(BillRequest request) {
        try {
            if (request.getId() == null) {
                throw new IllegalArgumentException("ID must not be null");
            }
            System.out.println("Received ID: " + request.getId());

            Optional<Bill> optional = hoaDonRepository.findById(request.getId());
            if (!optional.isPresent()) {
                throw new RestApiException(Message.NOT_EXISTS);
            }

            BillHistory history = BillHistory.builder()
                    .status(request.getInvoiceType() != TypeBill.TAI_QUAY ? StatusBill.THANH_CONG : StatusBill.CHO_XAC_NHAN)
                    .actionDescription(String.valueOf(request.getInvoiceType() != TypeBill.TAI_QUAY ? StatusBill.THANH_CONG : StatusBill.CHO_XAC_NHAN))
                    .bill(optional.get())
                    .employee(optional.get().getEmployee())
                    .build();
            lichSuHoaDonRepository.save(history);

            request.getPaymentsMethodRequests().forEach(item -> {

                Payment paymentsMethod = Payment.builder()
                        .method(item.getMethod())
                        .status(StatusPayMents.valueOf(request.getPaymentStatus()))
                        .employee(optional.get().getEmployee())
                        .totalMoney(item.getTotalMoney())
                        .transactionNo(item.getTransactionNo())
                        .bill(optional.get())
                        .build();
                thanhToanRespository.save(paymentsMethod);

            });
        } catch (Exception e) {
            System.out.println(e);
            throw e; // Đảm bảo ném lại ngoại lệ để rollback
        }

        return true;
    }
    @Override
    public String createFilePdfAtCounter(String code, BigDecimal totalExcessMoney) {
        Optional<Bill> optional = hoaDonRepository.findByCode(code);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), totalExcessMoney);
        Context dataContext = exportFilePdfFormHtml.setData(invoice);
        return springTemplateEngine.process("templateBill", dataContext);
    }

    @Override
    public String createAllFilePdf(ChangAllStatusBillByIdsRequest request) {
        StringBuilder stringBuilder = new StringBuilder();
        request.getIds().parallelStream().forEach(item -> {
            Optional<Bill> optional = hoaDonRepository.findById(item);
            InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), new BigDecimal(0));
            if (optional.get().getInvoiceStatus() != StatusBill.THANH_CONG) {
                invoice.setTypeBill(true);
                invoice.setCheckShip(true);
            }
            Context dataContext = exportFilePdfFormHtml.setData(invoice);
            stringBuilder.append(springTemplateEngine.process("templateBill", dataContext));
        });
        return stringBuilder.toString();
    }

}
