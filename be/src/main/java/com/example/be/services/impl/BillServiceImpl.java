package com.example.be.services.impl;

import com.example.be.dto.admin.request.bill.*;
import com.example.be.dto.admin.request.bill.billcustomer.ChangeCustomerRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.BillResponse;
import com.example.be.dto.admin.response.bill.InvoiceResponse;
import com.example.be.dto.admin.response.voucher.VoucherCustomerRepository;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.services.BillService;
import com.example.be.utils.MailUtils;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.*;
import com.example.be.utils.converter.BillConvert;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.exportPdf.ExportFilePdfFormHtml;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
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
    private VoucherCustomerRepository voucherCustomerRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private SpringTemplateEngine springTemplateEngine;
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    private ShirtDetailRepository chiTietSanPhamRepository;

    public BillServiceImpl(BillRepository hoaDonRepository, BillConvert billConvert, BillDetailRepository hoaDonChiTietRepository, BillHistoryRepository lichSuHoaDonRepository, EmployeeRepository nhanVienRepository, PaymentRepository thanhToanRespository, VoucherRepository phieuGiamGiaRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.billConvert = billConvert;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.thanhToanRespository = thanhToanRespository;
        this.phieuGiamGiaRepository = phieuGiamGiaRepository;
    }

    public static String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "N/A"; // or "0 VND" or any other placeholder you prefer
        }
        Locale localeVN = new Locale("vi", "VN");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
        return currencyFormatter.format(amount);
    }

    private void sendPaymentSuccessEmail(Bill bill) {
        String emailContent = "Chúc mừng bạn đã thanh toán thành công hóa đơn!\n\n"
                + "Chào " + bill.getRecipientName() + ",\n\n"
                + "Cảm ơn bạn đã mua sắm tại Berry Store! Chúng tôi vui mừng thông báo rằng bạn đã thanh toán thành công hóa đơn của mình.\n\n"
                + "Dưới đây là thông tin chi tiết về hóa đơn của bạn:\n"
                + "Mã hóa đơn: " + bill.getCode() + "\n"
                + "Tên người nhận: " + bill.getRecipientName() + "\n"
                + "Số điện thoại người nhận: " + bill.getRecipientPhone() + "\n"
                + "Địa chỉ giao hàng: " + bill.getAddress() + "\n"
                + "Tổng tiền hóa đơn: " + formatCurrency(bill.getTotalMoney()) + "\n"
                + "Phí vận chuyển: " + formatCurrency(bill.getShippingFee()) + "\n"
                + "Số tiền giảm giá: " + formatCurrency(bill.getDiscountAmount()) + "\n"
                + "Ngày thanh toán: " + bill.getConfirmationDate() + "\n\n"
                + "Chúng tôi sẽ sớm giao hàng đến bạn. Vui lòng kiểm tra lại thông tin của đơn hàng và liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào.\n\n"
                + "Đây là email tự động, vui lòng không trả lời email này.\n\n"
                + "Cảm ơn bạn đã ủng hộ Berry Store.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ Berry Store\n\n"
                + "Liên hệ: https://www.facebook.com/ninh.cong.9889";

        mailUtils.sendEmail(bill.getRecipientEmail(), "Xác nhận thanh toán thành công từ Berry Store", emailContent);
    }

    @Override
    public boolean createTemplateSendMail(Integer idBill, BigDecimal totalExcessMoney) {
        // begin create file pdf
        Optional<Bill> optional = hoaDonRepository.findById(idBill);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), totalExcessMoney);
        Bill bill = optional.get();
        String email = bill.getRecipientEmail();
        if (email == null) {
            return true;
        }
        if ((bill.getInvoiceStatus() == StatusBill.TRA_HANG || bill.getInvoiceStatus() != StatusBill.THANH_CONG) && !email.isEmpty()) {
            invoice.setCheckShip(true);
            mailUtils.sendEmail(bill.getRecipientPhone(),
                    "Xác nhận thanh toán thành công từ Berry Store", bill.getRecipientEmail());
        }
        return true;
    }

    @Override
    public boolean createTemplateSendMailClient(Integer idBill, BigDecimal totalExcessMoney) {
        return false;
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
        return hoaDonRepository.findByCode(ma);
    }

    @Override
    public Bill getOne(Integer id) {
        Optional<Bill> bill = hoaDonRepository.findById(id);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        return bill.get();
    }

    @Override
    public Bill deleted(Integer id) {
        thanhToanRespository.deleteAllByIdBill(id);
        hoaDonChiTietRepository.deleteAllByBill_Id(id);
        lichSuHoaDonRepository.deleteAllByBill_Id(id);
        hoaDonRepository.deleteById(id);
        return null;
    }

//
//    @Override
//    public Bill create(HttpServletRequest httpRequest) {
//        // Lấy employeeId từ request attributes (được set trong JwtTokenFilter)
//        Integer employeeId = (Integer) httpRequest.getAttribute("employeeId");
//
//        if (employeeId == null) {
//            throw new RuntimeException("Không tìm thấy ID nhân viên trong request.");
//        }
//
//        String employeeName = (String) httpRequest.getAttribute("employeeName");
//
//        // Kiểm tra nếu không có employeeName, có thể throw exception hoặc xử lý theo cách bạn muốn
//        if (employeeName == null) {
//            throw new RuntimeException("Không tìm thấy tên nhân viên trong request.");
//        }
//
//
//        // Tìm Employee từ employeeId
//        Employee employee = nhanVienRepository.findById(employeeId)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + employeeId));
//
//        // Tạo mới Bill và BillHistory
//        Bill hd = new Bill();
//        BillHistory lshd = new BillHistory();
//        hd.setEmployee(employee);  // Gán Employee vào Bill
//        hd.setCreatedBy(employeeName);
//        hd.setInvoiceStatus(StatusBill.TAO_HOA_DON);  // Trạng thái hóa đơn ban đầu
//        hd.setCode(genBillCode());  // Mã hóa đơn (gọi hàm sinh mã)
//        hd.setInvoiceType(TypeBill.TAI_QUAY);  // Loại hóa đơn
//
//        // Lưu hóa đơn vào cơ sở dữ liệu
//        Bill saveHD = hoaDonRepository.save(hd);
//
//        // Gán các thông tin cho lịch sử hóa đơn
//        lshd.setBill(saveHD);
//        lshd.setEmployee(saveHD.getEmployee());  // Gán thông tin nhân viên cho lịch sử
//        lshd.setActionDescription("Tạo đơn hàng");  // Mô tả hành động
//        lshd.setStatus(StatusBill.TAO_HOA_DON);  // Trạng thái lịch sử hóa đơn
//
//        // Lưu lịch sử hóa đơn vào cơ sở dữ liệu
//        lichSuHoaDonRepository.save(lshd);
//
//        // Trả về hóa đơn đã tạo
//        return saveHD;
//    }

    // Hàm này dùng để tạo 1 hóa đơn bán hàng tại quầy
    @Override
    public Bill create(BillRequest request) {
        Bill hd = new Bill();
        BillHistory lshd = new BillHistory();
        hd.setEmployee(nhanVienRepository.findById(request.getEmployeeId()).orElse(null));
        hd.setInvoiceStatus(StatusBill.TAO_HOA_DON);
        hd.setCode("HD" + System.currentTimeMillis());
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

            if ((request.getTypeVoucher()).equals("CONG_KHAI")){
                Voucher voucher = phieuGiamGiaRepository.findById(request.getVoucherId())
                        .orElseThrow(() -> new RestApiException("Voucher không tồn tại!"));
                if (voucher.getQuantity() <= 0) {
                    throw new RestApiException("Voucher công khai đã hết số lượng!");
                }
                voucher.setQuantity(voucher.getQuantity() - 1);
                phieuGiamGiaRepository.save(voucher);
            }
            else if ((request.getTypeVoucher()).equals("CA_NHAN")) {
                Bill existingBill = hoaDonRepository.findByVoucher(request.getVoucherId(), request.getCustomerId());
                if (existingBill != null) {
                    throw new RestApiException("Voucher này bạn đã sử dụng!");
                }
                VoucherCustomer voucherCustomer = voucherCustomerRepository.findByIdKhachHangAndIdPhieuGiamGia(
                        request.getCustomerId(), request.getVoucherId());
                if (voucherCustomer == null) {
                    throw new RestApiException("Voucher cá nhân không tồn tại hoặc không thuộc về bạn!");
                }
                voucherCustomer.setStatus(VoucherConstant.DA_SU_DUNG);
                voucherCustomerRepository.save(voucherCustomer);
            }
        }

        BillHistory lichSuHoaDon = new BillHistory();
//        Payment thanhToan = new Payment();
        Bill hoaDon = billConvert.convertRequestToEntity(hoaDonRepository.findById(id).get(), request);
        lichSuHoaDon.setBill(hoaDon);
        lichSuHoaDon.setEmployee(hoaDon.getEmployee());
//        thanhToan.setBill(hoaDon);
//        thanhToan.setMethod(StatusMethod.TIEN_MAT);

        if (request.getChoThanhToan()) {
            // Cập nhật trạng thái hóa đơn
            hoaDon.setInvoiceStatus(StatusBill.CHO_XAC_NHAN);
            hoaDonRepository.save(hoaDon);

            // Thêm bản ghi lịch sử CHỜ XÁC NHẬN
            lichSuHoaDon.setBill(hoaDon);
            lichSuHoaDon.setStatus(StatusBill.CHO_XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon);

            System.out.println("Lưu trạng thái CHỜ XÁC NHẬN thành công.");

            // Cập nhật trạng thái hóa đơn sang XÁC NHẬN
            hoaDon.setInvoiceStatus(StatusBill.XAC_NHAN);
            hoaDonRepository.save(hoaDon);

            // Thêm bản ghi lịch sử XÁC NHẬN
            BillHistory lichSuHoaDon1 = new BillHistory();
            lichSuHoaDon1.setBill(hoaDon);
            lichSuHoaDon1.setStatus(StatusBill.XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon1);

            System.out.println("Lưu trạng thái XÁC NHẬN thành công.");

            return hoaDon;
        }
        hoaDon.setInvoiceStatus(StatusBill.THANH_CONG);
        hoaDon.setReceivedDate(new Timestamp(System.currentTimeMillis()));
        BillHistory lshd = new BillHistory();
        lshd.setBill(hoaDon);
        lshd.setEmployee(hoaDon.getEmployee());
        lshd.setActionDescription(String.valueOf(StatusBill.THANH_CONG));
        lshd.setStatus(StatusBill.THANH_CONG);
        lichSuHoaDonRepository.save(lshd);

        createTemplateSendMail(hoaDon.getId(), request.getTotalMoney());
        hoaDonRepository.save(hoaDon);
        return hoaDon;
    }


//    @Override
//    public Bill orderBill(Integer id, BillRequest request) {
//        if (request.getVoucherId() != null) {
//            if (request.getTypeVoucher() == VoucherConstant.CONG_KHAI) {
//                Voucher phieuGiamGia = phieuGiamGiaRepository.findById(request.getVoucherId()).get();
//                phieuGiamGia.setQuantity(phieuGiamGia.getQuantity() - 1);
//                phieuGiamGiaRepository.save(phieuGiamGia);
//            } else {
//                Bill bills = hoaDonRepository.findByVoucher(request.getVoucherId());
//                if (bills == null) {
//                    VoucherCustomer voucherCustomer = voucherCustomerRepository.findByIdKhachHangAndIdPhieuGiamGia(request.getCustomerId(), request.getVoucherId());
//                    voucherCustomer.setStatus(VoucherConstant.DA_SU_DUNG);
//                    voucherCustomerRepository.save(voucherCustomer);
//                } else {
//                    throw new RestApiException("Voucher này bạn đã sử dụng!");
//                }
//            }
//        }
//
//        BillHistory lichSuHoaDon = new BillHistory();
//        Payment thanhToan = new Payment();
//        Bill hoaDon = billConvert.convertRequestToEntity(hoaDonRepository.findById(id).get(), request);
//        lichSuHoaDon.setBill(hoaDon);
//        lichSuHoaDon.setEmployee(hoaDon.getEmployee());
//        thanhToan.setBill(hoaDon);
//        thanhToan.setMethod(StatusMethod.TIEN_MAT);
//
//        if (request.getChoThanhToan()) {
//            hoaDon.setInvoiceStatus(StatusBill.CHO_XAC_NHAN);
//            lichSuHoaDon.setStatus(StatusBill.CHO_XAC_NHAN);
//            lichSuHoaDonRepository.save(lichSuHoaDon);
//            hoaDonRepository.save(hoaDon);
//            return hoaDon;
//        }
//        if (!request.getChoThanhToan()) {
//            List<BillDetail> hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonId(id);
//            for (BillDetail chiTiet : hoaDonChiTiet) {
//                ProductDetail chiTietSanPham = chiTiet.getProductDetail();
//                chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() - chiTiet.getQuantity());
//                chiTietSanPhamRepository.save(chiTietSanPham);
//            }
//        }
//
//        hoaDon.setInvoiceStatus(StatusBill.THANH_CONG);
//        hoaDon.setReceivedDate(new Timestamp(System.currentTimeMillis()));
//        BillHistory lshd = new BillHistory();
//        lshd.setBill(hoaDon);
//        lshd.setEmployee(hoaDon.getEmployee());
//        lshd.setActionDescription(String.valueOf(StatusBill.THANH_CONG));
//        lshd.setStatus(StatusBill.THANH_CONG);
//        lichSuHoaDonRepository.save(lshd);
//        CompletableFuture.runAsync(() -> createFilePdfAtCounter(hoaDon.getId()), Executors.newCachedThreadPool());
//        sendPaymentSuccessEmail(hoaDon);
//        hoaDonRepository.save(hoaDon);
//        return hoaDon;
//    }

//    @Override
//    public boolean changeQuantity(Integer id, List<BillDetail> billDetailNew) {
//        List<BillDetail> hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonId(id); //đAY LÀ  , danh sách hóa đơn cũ
//
//        Map<Integer, BillDetail> hoaDonChiTietMap = hoaDonChiTiet.stream()
//                .collect(Collectors.toMap(bd -> bd.getProductDetail().getId(), bd -> bd));
//
//        //  sản phẩm không tồn tại trong danh sách mới cộngo  lại số lượng cho sản phẩm tồn
//        for (BillDetail oldBillDetail : hoaDonChiTiet) {
//            if (!billDetailNew.stream()
//                    .anyMatch(newDetail -> newDetail.getProductDetail().getId().equals(oldBillDetail.getProductDetail().getId()))) {
//                ProductDetail chiTietSanPham = oldBillDetail.getProductDetail();
//                chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + oldBillDetail.getQuantity());
//                chiTietSanPhamRepository.save(chiTietSanPham);
//            }
//        }
//
//        for (BillDetail newBillDetail : billDetailNew) {
//            // Tìm sản phẩm trong danh sách cũ
//            ProductDetail chiTietSanPham = newBillDetail.getProductDetail();
//            BillDetail existingBillDetail = hoaDonChiTietMap.get(chiTietSanPham.getId());
//
//            if (existingBillDetail != null) {
//                // Cập nhật sản phẩm nếu đã tồn tại hãy kiểm trả xem nó số lượng cũ
//                // với số lượng mới nếu số lượng mới lớn hơn thì số lượng tòn trừ
//                int chechlech = newBillDetail.getQuantity() - existingBillDetail.getQuantity();
//                chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() - chechlech);
//            } else {
//                // Với sanr phẩm mới thì trừ số lượng
//                chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() - newBillDetail.getQuantity());
//            }
//
//            if (chiTietSanPham.getQuantity() < 0) {
//                throw new IllegalStateException("Số lượng tồn kho không đủ");
//            }
//
//            // Lưu lại thay đổi
//            chiTietSanPhamRepository.save(chiTietSanPham);
//        }

//        return true;
//    }

    @Override
    public boolean changeQuantity(Integer id, Integer nv) {
        List<BillDetail> hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonId(id);
        Optional<Bill> bill = hoaDonRepository.findById(id);
        Optional<Employee> employee = nhanVienRepository.findById(nv);
        for (BillDetail chiTiet : hoaDonChiTiet) {
            ProductDetail chiTietSanPham = chiTiet.getProductDetail();
            chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() - chiTiet.getQuantity());
            if (chiTiet.getQuantity() < 1) {
                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill.get());
                billHistory.setEmployee(employee.get());
                billHistory.setActionDescription("Sản phẩm: "+chiTietSanPham.getProduct().getName()+" số lượng tồn, yêu cầu chỉnh sửa số lượng hoặc thêm sản phẩm khác");
                billHistory.setStatus(StatusBill.THAY_DOI);
                lichSuHoaDonRepository.save(billHistory);

                BillHistory billHistory1 = new BillHistory();
                billHistory1.setBill(bill.get());
                billHistory1.setEmployee(employee.get());
                billHistory1.setActionDescription("Sản phẩm: "+chiTietSanPham.getProduct().getName()+" bị quá số lượng tồn, yêu cầu chỉnh sửa số lượng hoặc thêm sản phẩm khác");
                billHistory1.setStatus(StatusBill.CHO_XAC_NHAN);
                lichSuHoaDonRepository.save(billHistory1);
            } else if (chiTiet.getQuantity() > chiTietSanPham.getQuantity()) {
                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill.get());
                billHistory.setEmployee(employee.get());
                billHistory.setActionDescription("Sản phẩm: "+chiTietSanPham.getProduct().getName()+" bị quá số lượng tồn, yêu cầu chỉnh sửa số lượng hoặc thêm sản phẩm khác");
                billHistory.setStatus(StatusBill.THAY_DOI);
                lichSuHoaDonRepository.save(billHistory);

                BillHistory billHistory1 = new BillHistory();
                billHistory1.setBill(bill.get());
                billHistory1.setEmployee(employee.get());
                billHistory1.setActionDescription("Sản phẩm: "+chiTietSanPham.getProduct().getName()+" bị quá số lượng tồn, yêu cầu chỉnh sửa số lượng hoặc thêm sản phẩm khác");
                billHistory1.setStatus(StatusBill.CHO_XAC_NHAN);
                lichSuHoaDonRepository.save(billHistory1);
            }else {
                chiTietSanPhamRepository.save(chiTietSanPham);
            }
        }
        return true;
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
                bill.get().setReceivedDate(Timestamp.valueOf(vietnamTime.toLocalDateTime()));
                bill.get().setConfirmationDate(Timestamp.valueOf(vietnamTime.toLocalDateTime()));
            }
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
    //Hàm của Đức làm
    @Override
    public Bill changeStatusCancelBill(Integer id, Integer idEmployees, CancelBillClientRequest request) {
        Optional<Bill> bill = hoaDonRepository.findById(id);

        List<BillDetail> hoaDonChiTiet = hoaDonChiTietRepository.findByHoaDonId(id);
        for (BillDetail chiTiet : hoaDonChiTiet) {
            ProductDetail chiTietSanPham = chiTiet.getProductDetail(); // Lấy trực tiếp qua ánh xạ
            chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + chiTiet.getQuantity());
            chiTietSanPhamRepository.save(chiTietSanPham);
        }

        //Đây là nhân viên đang nhập
        Optional<Employee> employee = nhanVienRepository.findById(idEmployees);
        if (!bill.isPresent()) {
            throw new RestApiException(Message.BILL_NOT_EXIT);
        }
        if (!employee.isPresent()) {
//            throw new RestApiException(Message.ACCOUNT_IS_EXIT);
        }

        //Ko phải admin ko được hủy
        if (employee.get().getAccount().getRole().getId() != 1 ) {
            throw new RestApiException("Bạn không có quyền được đổi");
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

        //tOA LICH su thanh toan da duoc hoan tra
        if (bill.get().getPaymentStatus() == StatusPayMents.DA_THANH_TOAN ) {
            Payment payment = new Payment();
            payment.setMethod(StatusMethod.CHUYEN_KHOAN);
            payment.setBill(bill.get());
            payment.setTransactionNo(request.getTransactionNo());
            payment.setEmployee(employee.get());
            payment.setTransactionDate(Timestamp.valueOf(LocalDateTime.now()));
            payment.setTotalMoney(request.getTotalMoney());
            payment.setStatus(StatusPayMents.HOAN_TIEN);
            thanhToanRespository.save(payment);
        }


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
    public Bill changeInfoCustomer(Integer idHD, Integer idNV, BillRequest request) {
        //lẤY RA NHÂN VIÊN đang nhập
        Optional<Employee> employee = nhanVienRepository.findById(idNV);
        //Ban phai là admin mới được thay đổi ko cút
        if (!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
            throw new RestApiException("Bạn không có quyền được đổi, vai trò hiện tại: " + employee.get().getAccount().getRole().getName());
        }

        // Lấy hóa đơn theo idHD
        Bill bill = hoaDonRepository.findById(idHD).get();

        // Lấy thông tin khách hàng từ hóa đơn
        Customer customer = customerRepository.findByIdCustomer(request.getCustomerId());

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
        bill.setUpdatedBy(employee.get().getName());
        // Lưu lại hóa đơn với các thay đổi mới
        hoaDonRepository.save(bill);
        BillHistory lichSuHoaDon = new BillHistory();
        lichSuHoaDon.setBill(bill);
        lichSuHoaDon.setActionDescription("Đã thay đổi thông tin khách hàng " + bill.getRecipientName() + " với số điện thoại: " + bill.getRecipientPhone());
        lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
        lichSuHoaDonRepository.save(lichSuHoaDon);
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

            Optional<Employee> employee = nhanVienRepository.findById(request.getEmployeeId());
            //Ban phai là admin mới được thay đổi ko cút
            if (!employee.get().getAccount().getRole().getName().equals(Roles.ADMIN.name())) {
                throw new RestApiException("Bạn không có quyền được đổi, vai trò hiện tại: " + employee.get().getAccount().getRole().getName());
            }

//            BillHistory history = BillHistory.builder()
//                    .status(request.getInvoiceType() != TypeBill.TAI_QUAY ? StatusBill.THANH_CONG : StatusBill.DA_THANH_TOAN)
//                    .actionDescription(String.valueOf(request.getInvoiceType() != TypeBill.TAI_QUAY ? StatusBill.THANH_CONG : StatusBill.DA_THANH_TOAN))
//                    .bill(optional.get())
//                    .employee(optional.get().getEmployee())
//                    .build();
//            lichSuHoaDonRepository.save(history);

            request.getPaymentsMethodRequests().forEach(item -> {

                Payment paymentsMethod = Payment.builder()
                        .method(item.getMethod())
                        .status((request.getPaymentStatus()))
                        .employee(employee.get())
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
        Optional<Bill> optional = hoaDonRepository.findByCode1(code);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), totalExcessMoney);
        Context dataContext = exportFilePdfFormHtml.setData(invoice);
        return springTemplateEngine.process("templateBill", dataContext);
//        return code;
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


    @Override
    public PageableObject<BillResponse> getAllDonYeuCauHuy(BillSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonRepository.getAllHoaDonDonYeuCauHuy(request, pageable, 8));
    }

    @Override
    public boolean createFilePdfAtCounter(Integer idBill) {
        //     begin   create file pdf
        String finalHtml = null;
        Optional<Bill> optional = hoaDonRepository.findById(idBill);
        InvoiceResponse invoice = exportFilePdfFormHtml.getInvoiceResponse(optional.get(), new BigDecimal(0));
        Bill bill = optional.get();
        String email = bill.getRecipientEmail();
        if (email == null) {
            Context dataContext = exportFilePdfFormHtml.setData(invoice);
            finalHtml = springTemplateEngine.process("templateBill", dataContext);
            exportFilePdfFormHtml.htmlToPdf(finalHtml, bill.getCode());
            return true;
        }
        Context dataContext = exportFilePdfFormHtml.setData(invoice);
        finalHtml = springTemplateEngine.process("templateBill", dataContext);
        exportFilePdfFormHtml.htmlToPdf(finalHtml, bill.getCode());

        return true;
    }
}
