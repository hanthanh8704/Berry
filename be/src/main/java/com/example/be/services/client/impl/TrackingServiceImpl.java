package com.example.be.services.client.impl;

import com.example.be.dto.admin.request.bill.BillRequest;
import com.example.be.dto.admin.request.bill.CancelBillClientRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.client.request.BillRequestClient;
import com.example.be.entities.*;
import com.example.be.repositories.client.*;
import com.example.be.services.client.TrackingService;
import com.example.be.utils.constant.StatusBill;
import com.example.be.utils.constant.StatusMethod;
import com.example.be.utils.constant.StatusPayMents;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TrackingServiceImpl implements TrackingService {
    @Autowired
    BillRepositoryClient hoaDonRepository;
    @Autowired
    BillDetailRepositoryClient hoaDonChiTietRepository;
    @Autowired
    BillHistoryRepositoryClient lichSuHoaDonRepository;
    @Autowired
    ProductDetalRepositoryClient productDetalRepositoryClient;
    @Autowired
    VoucherRepositoryClient voucherRepositoryClient;
    @Autowired
    BillHistoryRepositoryClient billHistoryRepositoryClient;
    @Autowired
    PaymentRepositoryClient paymentRepositoryClient;

    @Override
    public Bill findByMaAndSDT(String ma, String sdt) {
        Bill hoaDon = hoaDonRepository.findByMaAndPhone(ma, sdt);
        return hoaDon;
    }

    @Override
    public BillRequestClient detailHoaDon(String ma) {
        Bill hoaDon = hoaDonRepository.findByCode(ma);

        List<BillDetail> hoaDonChiTietList = hoaDonChiTietRepository.findByBill(hoaDon);
        List<BillHistory> billHistories = lichSuHoaDonRepository.findAllByIdHD(hoaDon.getId());
        List<Payment> payments = paymentRepositoryClient.findByIdHoaDon(hoaDon.getId());
        BillRequestClient hoaDonRequest = new BillRequestClient();
        if (hoaDon != null) {
            hoaDonRequest.setId(hoaDon.getId());
            hoaDonRequest.setEmployee(hoaDon.getEmployee());
            hoaDonRequest.setVoucher(hoaDon.getVoucher());
            hoaDonRequest.setCustomerId(hoaDon.getCustomer().getId());
            hoaDonRequest.setBillDetails(hoaDonChiTietList);
            hoaDonRequest.setCode(hoaDon.getCode());
            hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
            hoaDonRequest.setRecipientName(hoaDon.getRecipientName());
            hoaDonRequest.setDiscountAmount(hoaDon.getDiscountAmount());
            hoaDonRequest.setTotalMoney(hoaDon.getTotalMoney());
            hoaDonRequest.setShippingFee(hoaDon.getShippingFee());
            hoaDonRequest.setRecipientEmail(hoaDon.getRecipientEmail());
            hoaDonRequest.setRecipientPhone(hoaDon.getRecipientPhone());
            hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
            hoaDonRequest.setDeliveryStatus(hoaDon.getDeliveryStatus());
            hoaDonRequest.setDeliveryDate(hoaDon.getDeliveryDate());
            hoaDonRequest.setReceivedDate(hoaDon.getReceivedDate());
            hoaDonRequest.setNote(hoaDon.getNote());
            hoaDonRequest.setAddress(hoaDon.getAddress());
            hoaDonRequest.setCreatedAt(hoaDon.getCreatedAt());
            hoaDonRequest.setUpdatedAt(hoaDon.getUpdatedAt());
            hoaDonRequest.setPaymentStatus(hoaDon.getPaymentStatus());
            hoaDonRequest.setBillHistory(billHistories);
            hoaDonRequest.setPayments(payments);
        } else {
            throw new RuntimeException("Không tìm thấy hóa đơn với mã: " + ma);
        }

        return hoaDonRequest;
    }

    //Hàm của Đức làm nut hủy đơn hàng
    @Override
    @Transactional
    public Bill changeStatusCancelBill(Integer id, CancelBillClientRequest request) {
        // Lấy hóa đơn
        Bill bill = hoaDonRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn!"));

        // Cập nhật thông tin hóa đơn
        bill.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        bill.setApprovalDate(Timestamp.valueOf(LocalDateTime.now()));
        bill.setInvoiceStatus(StatusBill.YEU_CAU_HUY);

        // Lưu lịch sử hóa đơn
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill);
        billHistory.setStatus(StatusBill.YEU_CAU_HUY);
        billHistory.setActionDescription(request.getDescription());
        lichSuHoaDonRepository.save(billHistory);

        // Lấy danh sách chi tiết hóa đơn liên quan
        List<BillDetail> billDetails = hoaDonChiTietRepository.findByBill(bill);

        // Cập nhật trạng thái cho tất cả các chi tiết hóa đơn
        billDetails.forEach(billDetail -> billDetail.setStatus(StatusBill.YEU_CAU_HUY));
        hoaDonChiTietRepository.saveAll(billDetails);


        // Lưu lại hóa đơn
        return hoaDonRepository.save(bill);
    }

    //Đây là những sản phẩm mới được thêm hay laf nuts chọn sản phẩm
    @Override
    public BillRequestClient selectedProductDetail(BillDetailRequest request, List<BillDetail> sanPhamCu) {
        // Lấy hóa đơn
        Bill hoaDon = hoaDonRepository.findById(request.getIdBill())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn!"));

        // Lấy chi tiết sản phẩm
        ProductDetail productDetail = productDetalRepositoryClient.findById(request.getIdChiTietSanPham())
                .orElseThrow(() -> new RestApiException("Không tìm thấy chi tiết sản phẩm!"));

        // Kiểm tra số lượng hợp lệ
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RestApiException("Số lượng không được để trống và phải lớn hơn 0!");
        }
        if (request.getQuantity() > productDetail.getQuantity()) {
            throw new RestApiException("Số lượng của bạn lớn hơn số lượng tồn!");
        }

        // Danh sách tạm thời chứa các chi tiết hóa đơn
        List<BillDetail> tempBillDetails = new ArrayList<>();

        boolean isProductExists = false; // Để theo dõi sản phẩm đã tồn tại hay chưa

        for (BillDetail b : sanPhamCu) {
            if (b.getProductDetail().getId().equals(productDetail.getId())) {
                isProductExists = true;

                // Kiểm tra nếu giá hoặc giảm giá thay đổi
                boolean isPriceChanged = b.getPrice().compareTo(productDetail.getPrice()) != 0;
                boolean isDiscountChanged = b.getPromotion() != productDetail.getDiscountPercentage();

                if (isPriceChanged || isDiscountChanged) {
                    // Tạo bản ghi mới
                    BillDetail newBillDetail = new BillDetail();
                    newBillDetail.setBill(hoaDon);
                    newBillDetail.setProductDetail(productDetail);
                    newBillDetail.setQuantity(request.getQuantity());
                    newBillDetail.setPrice(productDetail.getPrice());
                    newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
                    newBillDetail.setPromotion(productDetail.getDiscountPercentage());
                    tempBillDetails.add(newBillDetail); // Thêm sản phẩm mới vào danh sách tạm thời
                    hoaDonChiTietRepository.save(newBillDetail);
                } else {
                    // Nếu không thay đổi, cộng dồn số lượng
                    b.setQuantity(b.getQuantity() + request.getQuantity());
                }
            }

            // Luôn thêm bản ghi cũ vào danh sách tạm
            tempBillDetails.add(b);
        }

        // Nếu sản phẩm không tồn tại trong danh sách cũ, thêm sản phẩm mới
        if (!isProductExists) {
            BillDetail newBillDetail = new BillDetail();
            newBillDetail.setBill(hoaDon);
            newBillDetail.setProductDetail(productDetail);
            newBillDetail.setQuantity(request.getQuantity());
            newBillDetail.setPrice(productDetail.getPrice());
            newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
            newBillDetail.setPromotion(productDetail.getDiscountPercentage());
            tempBillDetails.add(newBillDetail); // Thêm sản phẩm mới
        }

        // Tạo đối tượng `BillRequestClient` để trả về
        BillRequestClient hoaDonRequest = new BillRequestClient();
        hoaDonRequest.setId(hoaDon.getId());
        hoaDonRequest.setEmployee(hoaDon.getEmployee());
        hoaDonRequest.setVoucher(hoaDon.getVoucher());
        hoaDonRequest.setCustomerId(hoaDon.getCustomer().getId());
        hoaDonRequest.setCode(hoaDon.getCode());
        hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
        hoaDonRequest.setRecipientName(hoaDon.getRecipientName());
        hoaDonRequest.setDiscountAmount(hoaDon.getDiscountAmount());
        hoaDonRequest.setTotalMoney(hoaDon.getTotalMoney());
        hoaDonRequest.setShippingFee(hoaDon.getShippingFee());
        hoaDonRequest.setRecipientEmail(hoaDon.getRecipientEmail());
        hoaDonRequest.setRecipientPhone(hoaDon.getRecipientPhone());
        hoaDonRequest.setDeliveryStatus(hoaDon.getDeliveryStatus());
        hoaDonRequest.setDeliveryDate(hoaDon.getDeliveryDate());
        hoaDonRequest.setReceivedDate(hoaDon.getReceivedDate());
        hoaDonRequest.setNote(hoaDon.getNote());
        hoaDonRequest.setAddress(hoaDon.getAddress());
        hoaDonRequest.setCreatedAt(hoaDon.getCreatedAt());
        hoaDonRequest.setUpdatedAt(hoaDon.getUpdatedAt());
        hoaDonRequest.setPaymentStatus(hoaDon.getPaymentStatus());
        hoaDonRequest.setBillHistory(lichSuHoaDonRepository.findAllByIdHD(hoaDon.getId()));

        // Gán danh sách sản phẩm đã cập nhật vào hóa đơn trả về
        hoaDonRequest.setBillDetails(tempBillDetails);

        return hoaDonRequest;
    }



    //Đây là nút đặt lại
    @Override
    public Bill updateDiaChi(BillRequest request) {
        // Lấy hóa đơn theo ID
        Bill bill = hoaDonRepository.findById(request.getId()).orElseThrow(() ->
                new IllegalArgumentException("Không tìm thấy hóa đơn với ID: " + request.getId())
        );

        // Cập nhật thông tin địa chỉ
        bill.setRecipientName(request.getRecipientName());
        bill.setRecipientPhone(request.getRecipientPhone());
        bill.setAddress(request.getDetailAddress());

        System.out.println("Payment Status: " + bill.getPaymentStatus());

        // Nếu trạng thái thanh toán là ĐÃ THANH TOÁN
        if (bill.getPaymentStatus().equals(StatusPayMents.DA_THANH_TOAN)) {
            BigDecimal newShippingFee = request.getShippingFee();
            BigDecimal oldShippingFee = bill.getShippingFee();
            System.out.println("new Status: " + request.getShippingFee());
            System.out.println("old Status: " + bill.getShippingFee());
            // Nếu phí vận chuyển mới lớn hơn phí vận chuyển cũ
            if (newShippingFee != null && oldShippingFee != null && request.getShippingFee().compareTo(bill.getShippingFee()) > 0) {
                System.out.println("Payment Status: " + bill.getPaymentStatus());
                Payment payment = new Payment();
                payment.setBill(bill);
                payment.setMethod(StatusMethod.TIEN_MAT);
                payment.setTotalMoney(newShippingFee.subtract(oldShippingFee)); // Tính số tiền khách hàng phải trả thêm
                payment.setStatus(StatusPayMents.TRA_SAU);

                // Lưu Payment vào cơ sở dữ liệu
                paymentRepositoryClient.save(payment);
            } else if (newShippingFee != null && oldShippingFee != null && newShippingFee.compareTo(oldShippingFee) < 0) { // Nếu phí vận chuyển mới nhỏ hơn phí vận chuyển cũ
                System.out.println("Payment Status: " + bill.getPaymentStatus());
                Payment payment = new Payment();
                payment.setBill(bill);
                payment.setMethod(StatusMethod.CHUYEN_KHOAN);
                payment.setTotalMoney(oldShippingFee.subtract(newShippingFee)); // Tính số tiền hoàn lại cho khách hàng
                payment.setStatus(StatusPayMents.HOAN_TIEN);

                // Lưu Payment vào cơ sở dữ liệu
                paymentRepositoryClient.save(payment);
            }

            BillHistory b = new BillHistory();
            b.setStatus(StatusBill.THAY_DOI);
            b.setBill(bill);
            b.setActionDescription("Khách hàng " + bill.getCustomer().getFullName() + "thay đổi địa chỉ");
            billHistoryRepositoryClient.save(b);

            BillHistory billHistory2 = new BillHistory();
            billHistory2.setBill(bill);
            billHistory2.setActionDescription("Chờ xác nhận");
            billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
            billHistoryRepositoryClient.save(billHistory2);

        } else {
            BigDecimal newShippingFee = request.getShippingFee();
            BigDecimal oldShippingFee = bill.getShippingFee();

            // Tìm Payment đã tồn tại
            Payment p = paymentRepositoryClient.findByBill(bill);

            if (p != null) {
                // Nếu phí vận chuyển mới lớn hơn phí vận chuyển cũ
                if (newShippingFee.compareTo(oldShippingFee) > 0) {
                    p.setTotalMoney(p.getTotalMoney().add(newShippingFee.subtract(oldShippingFee))); // Tính số tiền khách hàng phải trả thêm
                    // Cập nhật lại thông tin Payment trong cơ sở dữ liệu
                    paymentRepositoryClient.save(p);
                } else if (newShippingFee.compareTo(oldShippingFee) < 0) { // Nếu phí vận chuyển mới nhỏ hơn phí vận chuyển cũ
                    p.setTotalMoney(p.getTotalMoney().subtract(oldShippingFee.subtract(newShippingFee))); // Tính số tiền hoàn lại cho khách hàng
                    // Cập nhật lại thông tin Payment trong cơ sở dữ liệu
                    paymentRepositoryClient.save(p);
                }
            }
            BillHistory b = new BillHistory();
            b.setStatus(StatusBill.THAY_DOI);
            b.setBill(bill);
            b.setActionDescription("Khách hàng " + bill.getCustomer().getFullName() + "thay đổi địa chỉ");
            billHistoryRepositoryClient.save(b);

            BillHistory billHistory2 = new BillHistory();
            billHistory2.setBill(bill);
            billHistory2.setActionDescription("Chờ xác nhận");
            billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
            billHistoryRepositoryClient.save(billHistory2);
        }

        bill.setShippingFee(request.getShippingFee());
        // Lưu hóa đơn vào cơ sở dữ liệu
        hoaDonRepository.save(bill);


        return bill;
    }


    //Đây là nút đặt lại
    @Override
    public boolean reSetOrder(BillRequest request, List<BillDetail> sanPhamMoi) {

        Bill bill = hoaDonRepository.findById(request.getId()).get();
        BigDecimal soTienTruocKhiThayDoi = bill.getTotalMoney();
        BigDecimal phiVanChuyenTruocKhiThayDoi = bill.getShippingFee();

        //TRƯỜNG hợp 1 với đơn hàng là TRA_SAU đơn hàng tăng hoặc giảm
        if (bill.getPaymentStatus() == StatusPayMents.TRA_SAU) {
            if (request.getVoucherId() != null) { //TH 1 có thấy voucher mới phù hợp với hóa đơn sau khi đặt lại
                Voucher voucherNew = voucherRepositoryClient.findById(request.getVoucherId()).get();

                bill.setDiscountAmount(request.getDiscountAmount()); //Đây là chỗ của voucher mới
                bill.setTotalMoney(request.getTotalMoney()); //đây cũng là tổng tiền mới sau khi thêm hoặc giảm
                bill.setVoucher(voucherNew); //Đay là voucher mới sao cho phù hợp với đơn hàng sau khi gimar hoặc thêm
                bill.setShippingFee(request.getShippingFee());  //Set cho nó phí híp mới
                bill.setPaymentStatus(StatusPayMents.TRA_SAU);

                //Update laij bill detail
                List<BillDetail> billDetailList = hoaDonChiTietRepository.findByBill(bill);

                for (BillDetail oldBillDetail : billDetailList) {
                    boolean existsInNewList = sanPhamMoi.stream()
                            .anyMatch(newDetail -> newDetail.getProductDetail().getId().equals(oldBillDetail.getProductDetail().getId()));

                    if (!existsInNewList) {
                        // Xóa sản phẩm không tồn tại trong danh sách mới
                        hoaDonChiTietRepository.delete(oldBillDetail);
                    }
                }

                for (BillDetail newBillDetail : sanPhamMoi) {
                    // Tìm sản phẩm trong danh sách cũ
                    BillDetail existingBillDetail = billDetailList.stream()
                            .filter(oldDetail -> oldDetail.getProductDetail().getId().equals(newBillDetail.getProductDetail().getId()))
                            .findFirst()
                            .orElse(null);

                    if (existingBillDetail != null) {
                        // Cập nhật sản phẩm nếu đã tồn tại
                        existingBillDetail.setQuantity(newBillDetail.getQuantity());
                        existingBillDetail.setPrice(newBillDetail.getPrice());
                        hoaDonChiTietRepository.save(existingBillDetail);
                    } else {
                        // Thêm sản phẩm mới nếu chưa tồn tại
                        BillDetail newDetail = new BillDetail();
                        newDetail.setBill(bill);
                        newDetail.setProductDetail(productDetalRepositoryClient.findById(newBillDetail.getProductDetail().getId())
                                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!")));
                        newDetail.setQuantity(newBillDetail.getQuantity());
                        newDetail.setPrice(newBillDetail.getPrice());
                        newDetail.setPromotion(newBillDetail.getPromotion());
                        newDetail.setStatus(newBillDetail.getStatus());
                        hoaDonChiTietRepository.save(newDetail);
                    }
                }


                // Tạo mới lịch sử hóa đơn
                StringBuilder actionDescription = new StringBuilder("Mua lại đơn hàng với sản phẩm: ");
                for (BillDetail detail : sanPhamMoi) {
                    actionDescription.append(detail.getProductDetail().getDetailCode())
                            .append(" (Số lượng: ")
                            .append(detail.getQuantity())
                            .append("), ");
                }
                if (actionDescription.length() > 2) {
                    actionDescription.setLength(actionDescription.length() - 2); // Loại bỏ dấu phẩy cuối
                }

                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setActionDescription(actionDescription.toString());
                billHistory.setStatus(StatusBill.THAY_DOI);
                billHistoryRepositoryClient.save(billHistory);
                //Sau khi thêm mới 1 lịch sử là dạt lại xong lai tạo thêm 1 cai lịch sử là chờ xac snhanaj
                BillHistory billHistory2 = new BillHistory();
                billHistory2.setBill(bill);
                billHistory2.setActionDescription("Chờ xác nhận");
                billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
                billHistoryRepositoryClient.save(billHistory2);


                //Tao moi thanh toan
                //Nếu trạng thái hóa đơn ban đầu TRA_HANG thì tổng tiền sẽ được tính lại theo sô tiền củađơn hàng

                Payment payment = paymentRepositoryClient.findByBill(bill);

                payment.setTotalMoney(
                        request.getTotalMoney()
                                .add(request.getShippingFee())
                                .subtract(request.getDiscountAmount()));
                paymentRepositoryClient.save(payment);

                voucherNew.setQuantity(voucherNew.getQuantity() - 1);
                voucherRepositoryClient.save(voucherNew);
            } else { //Nếu không có voucher phù hợp thì set nó như cũ

                // Đặt giá trị của discountAmount là 0 khi voucher mới được áp dụng
                bill.setDiscountAmount(BigDecimal.ZERO);
                bill.setTotalMoney(request.getTotalMoney()); //đây cũng là tổng tiền mới sau khi thêm hoặc giảm
                bill.setVoucher(null);
                bill.setPaymentStatus(StatusPayMents.TRA_SAU);
                bill.setShippingFee(request.getShippingFee());  //Set cho nó phí híp mới

//                //Update laij bill detail
//                hoaDonChiTietRepository.saveAll(sanPhamMoi);
                //Update laij bill detail
                List<BillDetail> billDetailList = hoaDonChiTietRepository.findByBill(bill);

                for (BillDetail oldBillDetail : billDetailList) {
                    boolean existsInNewList = sanPhamMoi.stream()
                            .anyMatch(newDetail -> newDetail.getProductDetail().getId().equals(oldBillDetail.getProductDetail().getId()));

                    if (!existsInNewList) {
                        // Xóa sản phẩm không tồn tại trong danh sách mới
                        hoaDonChiTietRepository.delete(oldBillDetail);
                    }
                }

                for (BillDetail newBillDetail : sanPhamMoi) {
                    // Tìm sản phẩm trong danh sách cũ
                    BillDetail existingBillDetail = billDetailList.stream()
                            .filter(oldDetail -> oldDetail.getProductDetail().getId().equals(newBillDetail.getProductDetail().getId()))
                            .findFirst()
                            .orElse(null);

                    if (existingBillDetail != null) {
                        // Cập nhật sản phẩm nếu đã tồn tại
                        existingBillDetail.setQuantity(newBillDetail.getQuantity());
                        existingBillDetail.setPrice(newBillDetail.getPrice());
                        hoaDonChiTietRepository.save(existingBillDetail);
                    } else {
                        // Thêm sản phẩm mới nếu chưa tồn tại
                        BillDetail newDetail = new BillDetail();
                        newDetail.setBill(bill);
                        newDetail.setProductDetail(productDetalRepositoryClient.findById(newBillDetail.getProductDetail().getId())
                                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!")));
                        newDetail.setQuantity(newBillDetail.getQuantity());
                        newDetail.setPrice(newBillDetail.getPrice());
                        newDetail.setPromotion(newBillDetail.getPromotion());
                        newDetail.setStatus(newBillDetail.getStatus());
                        hoaDonChiTietRepository.save(newDetail);
                    }
                }

                // Tạo mới lịch sử hóa đơn
                StringBuilder actionDescription = new StringBuilder("Mua lại đơn hàng với sản phẩm: ");
                for (BillDetail detail : sanPhamMoi) {
                    actionDescription.append(detail.getProductDetail().getDetailCode())
                            .append(" (Số lượng: ")
                            .append(detail.getQuantity())
                            .append("), ");
                }
                if (actionDescription.length() > 2) {
                    actionDescription.setLength(actionDescription.length() - 2); // Loại bỏ dấu phẩy cuối
                }

                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setActionDescription(actionDescription.toString());
                billHistory.setStatus(StatusBill.THAY_DOI);
                billHistoryRepositoryClient.save(billHistory);
                //Sau khi thêm mới 1 lịch sử là dạt lại xong lai tạo thêm 1 cai lịch sử là chờ xac snhanaj
                BillHistory billHistory2 = new BillHistory();
                billHistory2.setBill(bill);
                billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
                billHistory2.setActionDescription("Chờ xác nhận");
                billHistoryRepositoryClient.save(billHistory2);


                //Tao moi thanh toan
                //Nếu trạng thái hóa đơn ban đầu TRA_HANG thì tổng tiền sẽ được tính lại theo sô tiền củađơn hàng
                Payment payment = paymentRepositoryClient.findByBill(bill);
                payment.setTotalMoney(
                        request.getTotalMoney()
                                .add(request.getShippingFee()));

                paymentRepositoryClient.save(payment);
            }
        } else if (bill.getPaymentStatus() == StatusPayMents.DA_THANH_TOAN) {
            if (request.getVoucherId() != null) { //Voucher mới đã được áp dụng lại cho đơn hàng
                //Với trường hợp 2 đơn hàng đã được thanh toán băng VN pay rồi thì
                Voucher voucherNew = voucherRepositoryClient.findById(request.getVoucherId()).get();
                bill.setDiscountAmount(request.getDiscountAmount()); //Đây là chỗ của voucher mới
                bill.setTotalMoney(request.getTotalMoney()); //đây cũng là tổng tiền mới sau khi thêm hoặc giảm
                bill.setVoucher(voucherNew); //Đay là voucher mới sao cho phù hợp với đơn hàng sau khi gimar hoặc thêm
                bill.setShippingFee(request.getShippingFee());  //Set cho nó phí híp mới

//                //Update laij bill detail
//                hoaDonChiTietRepository.saveAll(sanPhamMoi);
                //Update laij bill detail
                List<BillDetail> billDetailList = hoaDonChiTietRepository.findByBill(bill);

                for (BillDetail oldBillDetail : billDetailList) {
                    boolean existsInNewList = sanPhamMoi.stream()
                            .anyMatch(newDetail -> newDetail.getProductDetail().getId().equals(oldBillDetail.getProductDetail().getId()));

                    if (!existsInNewList) {
                        // Xóa sản phẩm không tồn tại trong danh sách mới
                        hoaDonChiTietRepository.delete(oldBillDetail);
                    }
                }

                for (BillDetail newBillDetail : sanPhamMoi) {
                    // Tìm sản phẩm trong danh sách cũ
                    BillDetail existingBillDetail = billDetailList.stream()
                            .filter(oldDetail -> oldDetail.getProductDetail().getId().equals(newBillDetail.getProductDetail().getId()))
                            .findFirst()
                            .orElse(null);

                    if (existingBillDetail != null) {
                        // Cập nhật sản phẩm nếu đã tồn tại
                        existingBillDetail.setQuantity(newBillDetail.getQuantity());
                        existingBillDetail.setPrice(newBillDetail.getPrice());
                        hoaDonChiTietRepository.save(existingBillDetail);
                    } else {
                        // Thêm sản phẩm mới nếu chưa tồn tại
                        BillDetail newDetail = new BillDetail();
                        newDetail.setBill(bill);
                        newDetail.setProductDetail(productDetalRepositoryClient.findById(newBillDetail.getProductDetail().getId())
                                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!")));
                        newDetail.setQuantity(newBillDetail.getQuantity());
                        newDetail.setPrice(newBillDetail.getPrice());
                        newDetail.setPromotion(newBillDetail.getPromotion());
                        newDetail.setStatus(newBillDetail.getStatus());
                        hoaDonChiTietRepository.save(newDetail);
                    }
                }

                // Tạo mới lịch sử hóa đơn
                StringBuilder actionDescription = new StringBuilder("Mua lại đơn hàng với sản phẩm: ");
                for (BillDetail detail : sanPhamMoi) {
                    actionDescription.append(detail.getProductDetail().getDetailCode())
                            .append(" (Số lượng: ")
                            .append(detail.getQuantity())
                            .append("), ");
                }
                if (actionDescription.length() > 2) {
                    actionDescription.setLength(actionDescription.length() - 2); // Loại bỏ dấu phẩy cuối
                }

                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setActionDescription(actionDescription.toString());
                billHistory.setStatus(StatusBill.THAY_DOI);
                billHistoryRepositoryClient.save(billHistory);
                //Sau khi thêm mới 1 lịch sử là dạt lại xong lai tạo thêm 1 cai lịch sử là chờ xac snhanaj
                BillHistory billHistory2 = new BillHistory();
                billHistory2.setBill(bill);
                billHistory2.setActionDescription(actionDescription.toString());
                billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
                billHistory2.setActionDescription("Chờ xác nhận");
                billHistoryRepositoryClient.save(billHistory2);


                // Tạo mới thanh toán
                BigDecimal chenhLech = request.getTotalMoney().subtract(soTienTruocKhiThayDoi);
                BigDecimal tinhSoTienPhiVanChuyenMoi = request.getShippingFee().subtract(phiVanChuyenTruocKhiThayDoi);

                Payment payment = new Payment();
                payment.setBill(bill);

                // So sánh phí vận chuyển cũ và mới
                if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) > 0) {
                    // Nếu phí vận chuyển mới lớn hơn phí cũ
                    payment.setTotalMoney(chenhLech.abs().multiply(BigDecimal.ONE.subtract(voucherNew.getDiscountValue().divide(BigDecimal.valueOf(100)))).subtract(tinhSoTienPhiVanChuyenMoi)); // Cộng thêm chênh lệch phí vận chuyển
                } else if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) < 0) {
                    // Nếu phí vận chuyển mới nhỏ hơn phí cũ
                    payment.setTotalMoney(chenhLech.abs().multiply(BigDecimal.ONE.subtract(voucherNew.getDiscountValue().divide(BigDecimal.valueOf(100)))).subtract(phiVanChuyenTruocKhiThayDoi.subtract(request.getShippingFee()))); // Trừ chênh lệch phí vận chuyển
                } else if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) == 0) {
                    payment.setTotalMoney(chenhLech.abs().multiply(BigDecimal.ONE.subtract(voucherNew.getDiscountValue().divide(BigDecimal.valueOf(100))))); //
                }

                // Xử lý thanh toán
                if (chenhLech.compareTo(BigDecimal.ZERO) > 0) {
                    // Nếu tổng tiền chênh lệch lớn hơn 0, trạng thái là "Trả sau"
                    payment.setMethod(StatusMethod.TIEN_MAT);
                    payment.setStatus(StatusPayMents.TRA_SAU);
                } else if (chenhLech.compareTo(BigDecimal.ZERO) < 0) {
                    // Nếu tổng tiền chênh lệch nhỏ hơn 0, trạng thái là "Hoàn tiền"
                    payment.setMethod(StatusMethod.CHUYEN_KHOAN);
                    payment.setStatus(StatusPayMents.HOAN_TIEN);
                }

                // Lưu thông tin thanh toán
                paymentRepositoryClient.save(payment);


                // Trừ số lượng voucher
                voucherNew.setQuantity(voucherNew.getQuantity() - 1);
                voucherRepositoryClient.save(voucherNew);

            } else {

                // Đặt giá trị của discountAmount là 0 khi voucher mới được áp dụng
                bill.setDiscountAmount(BigDecimal.ZERO);
                bill.setTotalMoney(request.getTotalMoney()); //đây cũng là tổng tiền mới sau khi thêm hoặc giảm
                bill.setVoucher(null); //Đay là voucher mới sao cho phù hợp với đơn hàng sau khi gimar hoặc thêm
                bill.setShippingFee(request.getShippingFee());  //Set cho nó phí híp mới

                List<BillDetail> billDetailList = hoaDonChiTietRepository.findByBill(bill);

                for (BillDetail oldBillDetail : billDetailList) {
                    boolean existsInNewList = sanPhamMoi.stream()
                            .anyMatch(newDetail -> newDetail.getProductDetail().getId().equals(oldBillDetail.getProductDetail().getId()));

                    if (!existsInNewList) {
                        // Xóa sản phẩm không tồn tại trong danh sách mới
                        hoaDonChiTietRepository.delete(oldBillDetail);
                    }
                }

                for (BillDetail newBillDetail : sanPhamMoi) {
                    // Tìm sản phẩm trong danh sách cũ
                    BillDetail existingBillDetail = billDetailList.stream()
                            .filter(oldDetail -> oldDetail.getProductDetail().getId().equals(newBillDetail.getProductDetail().getId()))
                            .findFirst()
                            .orElse(null);

                    if (existingBillDetail != null) {
                        // Cập nhật sản phẩm nếu đã tồn tại
                        existingBillDetail.setQuantity(newBillDetail.getQuantity());
                        existingBillDetail.setPrice(newBillDetail.getPrice());
                        hoaDonChiTietRepository.save(existingBillDetail);
                    } else {
                        // Thêm sản phẩm mới nếu chưa tồn tại
                        BillDetail newDetail = new BillDetail();
                        newDetail.setBill(bill);
                        newDetail.setProductDetail(productDetalRepositoryClient.findById(newBillDetail.getProductDetail().getId())
                                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!")));
                        newDetail.setQuantity(newBillDetail.getQuantity());
                        newDetail.setPrice(newBillDetail.getPrice());
                        newDetail.setPromotion(newBillDetail.getPromotion());
                        newDetail.setStatus(newBillDetail.getStatus());
                        hoaDonChiTietRepository.save(newDetail);
                    }
                }

                // Tạo mới lịch sử hóa đơn
                StringBuilder actionDescription = new StringBuilder("Mua lại đơn hàng với sản phẩm: ");
                for (BillDetail detail : sanPhamMoi) {
                    actionDescription.append(detail.getProductDetail().getDetailCode())
                            .append(" (Số lượng: ")
                            .append(detail.getQuantity())
                            .append("), ");
                }
                if (actionDescription.length() > 2) {
                    actionDescription.setLength(actionDescription.length() - 2);
                }

                BillHistory billHistory = new BillHistory();
                billHistory.setBill(bill);
                billHistory.setActionDescription(actionDescription.toString());
                billHistory.setStatus(StatusBill.THAY_DOI);
                billHistoryRepositoryClient.save(billHistory);
                //Sau khi thêm mới 1 lịch sử là dạt lại xong lai tạo thêm 1 cai lịch sử là chờ xac snhanaj
                BillHistory billHistory2 = new BillHistory();
                billHistory2.setBill(bill);
                billHistory2.setActionDescription(actionDescription.toString());
                billHistory2.setStatus(StatusBill.CHO_XAC_NHAN);
                billHistory2.setActionDescription("Chờ xác nhận");
                billHistoryRepositoryClient.save(billHistory2);


                // Tạo mới thanh toán
                BigDecimal chenhLech = request.getTotalMoney().subtract(soTienTruocKhiThayDoi);
                BigDecimal tinhSoTienPhiVanChuyenMoi = request.getShippingFee().subtract(phiVanChuyenTruocKhiThayDoi);

                Payment payment = new Payment();
                payment.setBill(bill);

                // So sánh phí vận chuyển cũ và mới
                if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) > 0) {
                    // Nếu phí vận chuyển mới lớn hơn phí cũ
                    payment.setTotalMoney(chenhLech.abs().subtract(tinhSoTienPhiVanChuyenMoi)); // Cộng thêm chênh lệch phí vận chuyển
                } else if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) < 0) {
                    // Nếu phí vận chuyển mới nhỏ hơn phí cũ
                    payment.setTotalMoney(chenhLech.abs().subtract(phiVanChuyenTruocKhiThayDoi.subtract(request.getShippingFee()))); // Trừ chênh lệch phí vận chuyển
                } else if (tinhSoTienPhiVanChuyenMoi.compareTo(BigDecimal.ZERO) == 0) {
                    payment.setTotalMoney(chenhLech.abs()); //
                }

                // Xử lý thanh toán
                if (chenhLech.compareTo(BigDecimal.ZERO) > 0) {
                    // Nếu tổng tiền chênh lệch lớn hơn 0, trạng thái là "Trả sau"
                    payment.setMethod(StatusMethod.TIEN_MAT);
                    payment.setStatus(StatusPayMents.TRA_SAU);
                } else if (chenhLech.compareTo(BigDecimal.ZERO) < 0) {
                    // Nếu tổng tiền chênh lệch nhỏ hơn 0, trạng thái là "Hoàn tiền"
                    payment.setMethod(StatusMethod.CHUYEN_KHOAN);
                    payment.setStatus(StatusPayMents.HOAN_TIEN);
                }

                // Lưu thông tin thanh toán
                paymentRepositoryClient.save(payment);
            }
        }

        return true;
    }


}
