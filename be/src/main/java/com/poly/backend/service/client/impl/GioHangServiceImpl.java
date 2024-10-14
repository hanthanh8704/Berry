package com.poly.backend.service.client.impl;

import com.google.zxing.WriterException;
import com.poly.backend.config.FormatCurrency;
import com.poly.backend.dto.client.request.GioHangChiTietRequest;
import com.poly.backend.dto.client.request.GioHangRequest;
import com.poly.backend.dto.request.diachi.DiaChiRequest;
import com.poly.backend.dto.request.hoadon.HoaDonRequest;
import com.poly.backend.dto.request.khachhang.KhachHangRequest;
import com.poly.backend.dto.request.sanpham.SanPhamRequest;
import com.poly.backend.entity.English.*;
import com.poly.backend.infrastructure.MailUtils;
import com.poly.backend.infrastructure.QRCodeGenerator;
import com.poly.backend.infrastructure.common.ResponseObject;
import com.poly.backend.infrastructure.converter.GioHangConvert;
import com.poly.backend.infrastructure.exception.RestApiException;
import com.poly.backend.repository.*;
import com.poly.backend.repository.client.GioHangChiTietRepository;
import com.poly.backend.repository.client.GioHangRepository;
import com.poly.backend.repository.client.ThanhToanClientRepository;
import com.poly.backend.service.client.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GioHangServiceImpl implements GioHangService {
    @Autowired
    GioHangRepository gioHangRepository;
    @Autowired
    GioHangChiTietRepository gioHangChiTietRepository;
    @Autowired
    GioHangConvert gioHangConvert;
    @Autowired
    SPCT_Repository spct_repository;
    @Autowired
    DiaChiRepository diaChiRepository;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    ThanhToanClientRepository thanhToanClientRepository;
    @Autowired
    HoaDonRepository hoaDonRepository;
    @Autowired
    HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    LichSuHoaDonRepository lichSuHoaDonRepository;
    @Autowired
    SanPhamRepository sanPhamRepository;
    @Autowired
    PhieuGiamGiaRepository phieuGiamGiaRepository;
    @Autowired
    ThanhToanRepository thanhToanRepository;
    @Autowired
    MailUtils mailUtils;

    @Override
    public List<GioHangChiTietRequest> getAll(Integer idKH) {
        List<Cart_detail> gioHangChiTietList = gioHangChiTietRepository.findAllByIdKh(idKH);
        List<GioHangChiTietRequest> gioHangChiTietRequests = new ArrayList<>();

        for (Cart_detail gioHangChiTiet : gioHangChiTietList) {
            // Chuyển đổi từ entity GioHangChiTiet sang DTO GioHangChiTietRequest
            GioHangChiTietRequest gioHangChiTietRequest = new GioHangChiTietRequest();
            gioHangChiTietRequest.setId(gioHangChiTiet.getId());
            gioHangChiTietRequest.setProductDetail(gioHangChiTiet.getProductDetail());
            gioHangChiTietRequest.setCart(gioHangChiTiet.getCart());
            gioHangChiTietRequest.setQuantity(gioHangChiTiet.getQuantity());
            gioHangChiTietRequest.setPrice(gioHangChiTiet.getPrice());
            gioHangChiTietRequest.setCreatedAt(gioHangChiTiet.getCreatedAt());
            gioHangChiTietRequest.setCreatedBy(gioHangChiTiet.getCreatedBy());
            gioHangChiTietRequest.setUpdatedBy(gioHangChiTiet.getUpdatedBy());
//            gioHangChiTietRequest.setUpdated_at(gioHangChiTiet.getNguoiSua());
            // Thêm các trường cần thiết khác từ GioHangChiTiet vào GioHangChiTietRequest

            gioHangChiTietRequests.add(gioHangChiTietRequest);
        }

        return gioHangChiTietRequests;
    }


    private String genCode() {
        String prefix = "GH00";
        int x = 1;
        String ma = prefix + x;
        while (gioHangRepository.existsByCode(ma)) {
            x++;
            ma = prefix + x;
        }
        return ma;
    }

    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(GioHangRequest request) {
        // Kiểm tra request
//        if (request == null || request.getCustomerId() == null || request.getSpctId() == null || request.getQuantity() == null) {
//            throw new RestApiException("Thông tin giỏ hàng không hợp lệ.");
//        }

        // Tìm giỏ hàng hiện tại của khách hàng
        Cart existingGioHang = gioHangRepository.findByKhachHangId(request.getCustomerId());

        Integer spctId = request.getSpctId();
        ProductDetail sanPhamCT = spct_repository.findById(spctId)
                .orElseThrow(() -> new RestApiException("Sản phẩm không tồn tại"));

        if (existingGioHang != null) {
            Cart_detail existingGioHangChiTiet = gioHangChiTietRepository.findBySpctId(spctId, existingGioHang.getId());

            if (existingGioHangChiTiet != null) {
                if (!sanPhamCT.getPrice().equals(existingGioHangChiTiet.getPrice())) {
                    // Case 2: Nếu sản phẩm được thay đổi giá bán, thêm bản ghi mới với giá mới vaf lúc này giá giảm phải chưa có
                    request.setSpct(sanPhamCT);
                    Cart_detail gioHangChiTiet = new Cart_detail();
                    gioHangChiTiet.setCart(existingGioHang);
                    gioHangChiTiet.setProductDetail(sanPhamCT);
                    // Sử dụng đúng phương thức để lấy giá (price hoặc discountPrice)
                    gioHangChiTiet.setPrice(sanPhamCT.getDiscountPrice().compareTo(BigDecimal.ZERO) == 0 ? sanPhamCT.getPrice() : sanPhamCT.getDiscountPrice());
                    gioHangChiTiet.setQuantity(request.getQuantity());  // Lấy số lượng từ request
                    gioHangChiTiet.setCreatedAt(LocalDateTime.now());   // Thời gian hiện tại
                    gioHangChiTietRepository.save(gioHangChiTiet);      // Lưu bản ghi mới vào giỏ hàng
                } else {
                    // Nếu sản phẩm đã tồn tại và không thay đổi giá, chỉ cập nhật số lượng
                    request.setSpct(sanPhamCT);
                    existingGioHangChiTiet.setQuantity(existingGioHangChiTiet.getQuantity() + request.getQuantity());
                    gioHangChiTietRepository.save(existingGioHangChiTiet); // Cập nhật số lượng sản phẩm trong giỏ hàng
                }

            } else {
                // Tạo mới chi tiết giỏ hàng
                request.setSpct(sanPhamCT);
                Cart_detail gioHangChiTiet = new Cart_detail();
                gioHangChiTiet.setCart(existingGioHang);
                gioHangChiTiet.setProductDetail(sanPhamCT);
                gioHangChiTiet.setPrice(sanPhamCT.getDiscountPrice().compareTo(BigDecimal.ZERO) == 0 ? sanPhamCT.getPrice() : sanPhamCT.getDiscountPrice());
                gioHangChiTiet.setQuantity(request.getQuantity());
                gioHangChiTiet.setCreatedBy("Admin");
                gioHangChiTiet.setUpdatedBy("Admin");
                gioHangChiTietRepository.save(gioHangChiTiet);
            }
        } else {
            // Tạo giỏ hàng mới
            request.setCode(genCode());
            request.setStatus("Hoạt động");
            request.setCreatedAt(LocalDateTime.now());
            request.setSpct(sanPhamCT);
            Cart gioHangSave = gioHangRepository.save(gioHangConvert.convertRequestToEntity(request));

            // Tạo chi tiết giỏ hàng
            Cart_detail gioHangChiTiet = new Cart_detail();
            gioHangChiTiet.setCart(gioHangSave);
            gioHangChiTiet.setProductDetail(sanPhamCT);
            gioHangChiTiet.setQuantity(request.getQuantity());
            gioHangChiTiet.setPrice(sanPhamCT.getDiscountPrice().compareTo(BigDecimal.ZERO) == 0 ? sanPhamCT.getPrice() : sanPhamCT.getDiscountPrice());
            gioHangChiTiet.setCreatedBy("Admin");
            gioHangChiTiet.setUpdatedBy("Admin");
            gioHangChiTietRepository.save(gioHangChiTiet);
        }


        return new ResponseObject(request);
    }


    @Override
    public GioHangRequest muaHang(GioHangRequest request) {
        // Danh sách chi tiết giỏ hàng cho giỏ hàng ảo
        List<Cart_detail> chiTietListAo = new ArrayList<>();

        // Lấy các sản phẩm từ giỏ hàng cũ dựa trên các id sản phẩm chi tiết trong request
        for (Integer id : request.getIdGHCT()) {
            Cart_detail chiTiet = gioHangChiTietRepository.findById(id).orElse(null);
            ProductDetail spct = spct_repository.findById(chiTiet.getProductDetail().getId()).get();


            if (chiTiet != null) {
                chiTietListAo.add(chiTiet);
            }
        }

        // Lấy giỏ hàng chính của khách hàng
        Cart gioHangCu = gioHangRepository.findByKhachHangId(request.getCustomer().getId());

        // Tạo giỏ hàng ảo từ thông tin giỏ hàng cũ
        GioHangRequest gioHangAo = new GioHangRequest();
        gioHangAo.setId(gioHangCu.getId());  // ID vẫn giữ nguyên để liên kết với giỏ hàng cũ
        gioHangAo.setCustomer(gioHangCu.getCustomer());
        gioHangAo.setCode(gioHangCu.getCode() + "-AO");  // Mã giỏ hàng mới có thể đánh dấu là ảo
        gioHangAo.setCreatedAt(gioHangCu.getCreatedAt());  // Giữ nguyên ngày tạo giỏ hàng cũ
        gioHangAo.setStatus("Chờ thanh toán");  // Giỏ hàng ảo với trạng thái mới
        gioHangAo.setListCartDetails(chiTietListAo);  // Chỉ bao gồm các sản phẩm đã chọn

        return gioHangAo;  // Trả về giỏ hàng ảo để sử dụng trong trang thanh toán
    }

    private String genCodeHD() {
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
    public ResponseObject thanhToan(HoaDonRequest request) {
        // Lấy phương thức thanh toán từ request
//        Payment thanhToanMethod = thanhToanRepository.findById(request.getPaymentId())
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán!"));

        Customer customer = khachHangRepository.findById(request.getCustomerId()).get();
        // Tạo mới hóa đơn
        Bill hoaDon = new Bill();
        hoaDon.setCustomer(customer);
        hoaDon.setCode(genCodeHD());
        hoaDon.setInvoiceType("Giao hàng");
        hoaDon.setEmployee(null);

        // Xét trạng thái hóa đơn dựa trên phương thức thanh toán
        if (request.getPaymentId() == 1) { //Day la chuyển khoản
            hoaDon.setInvoiceStatus(StatusBil.CHO_XAC_NHAN); //1 là chờ xác nhận
            hoaDon.setPaymentStatus("Đã thanh toán");
        } else {
            hoaDon.setPaymentStatus(null);
            hoaDon.setInvoiceStatus(StatusBil.CHO_XAC_NHAN);
        }

//        // Xét mã giao dịch
//        if (thanhToanMethod.getId() == 1) {
//            hoaDon.setMaGiaoDich(request.getMaGiaoDich());
//        } else {
//            hoaDon.setMaGiaoDich(null);
//        }

        // Thiết lập các thuộc tính khác cho hóa đơn
        hoaDon.setVoucher(request.getVoucher());
        hoaDon.setRecipientName(customer.getFullName());
        hoaDon.setDiscountAmount(request.getDiscountAmount());
        hoaDon.setTotalMoney(request.getTotalMoney());
        hoaDon.setShippingFee(request.getShippingFee());
        hoaDon.setRecipientEmail(customer.getEmail());
        hoaDon.setRecipientPhone(customer.getPhoneNumber());
//        hoaDon.set(request.getTongTienSauGiamGia());
        hoaDon.setAddress(request.getAddress());
//        hoaDon.set("Chờ xác nhận");
        hoaDon.setNote(request.getNote());
        hoaDon.setDeliveryStatus(null); //Trang thái giao hàng
        hoaDon.setConfirmationDate(null); // Ngày xác nhân háo đơn
        hoaDon.setDeliveryDate(null); //Ngay giao hang
        hoaDon.setShippingTime(null); //Thoi gian giao
        hoaDon.setReceivedDate(null); // Ngày người nhận hàng đã nhận được
        hoaDon.setDeleted(false);
        hoaDon.setCreatedAt(request.getCreatedAt());
        hoaDon.setUpdatedBy(request.getUpdatedBy());
        hoaDon.setCreatedBy(null);
        hoaDon.setUpdatedBy(null);

        // Lưu hóa đơn
        hoaDonRepository.save(hoaDon);

        // Lưu chi tiết hóa đơn
        for (Integer x : request.getIdSPCTs()) {
            Cart_detail gioHangChiTiet = gioHangChiTietRepository.findByIdSPCT(x, customer.getId());
//            if (gioHangChiTiets.isEmpty()) {
//                System.out.println("Không tìm thấy GioHangChiTiet cho idSPCT: " + x);
//                continue;
//            }
//                GioHangChiTiet gioHangChiTiet = optionalGioHangChiTiet.get();

            // Xử lý và lưu HoaDonChiTiet
            Bill_detail hoaDonChiTiet = new Bill_detail();
            hoaDonChiTiet.setProductDetail(gioHangChiTiet.getProductDetail());
            hoaDonChiTiet.setBill(hoaDon);
            hoaDonChiTiet.setQuantity(gioHangChiTiet.getQuantity());
            hoaDonChiTiet.setPrice(
                    gioHangChiTiet.getProductDetail().getDiscountPrice().compareTo(BigDecimal.ZERO) == 0
                            ? gioHangChiTiet.getProductDetail().getPrice()
                            : gioHangChiTiet.getProductDetail().getDiscountPrice()
            );
            hoaDonChiTiet.setCreatedAt(hoaDon.getCreatedAt());
            hoaDonChiTiet.setUpdatedAt(hoaDon.getUpdatedAt());
            hoaDonChiTiet.setStatus(1);
            hoaDonChiTietRepository.save(hoaDonChiTiet);
            gioHangChiTietRepository.delete(gioHangChiTiet);

            // Cập nhật số lượng của SPCT
            Optional<ProductDetail> optionalSPCT = spct_repository.findById(x);
            if (!optionalSPCT.isPresent()) {
                System.out.println("Không tìm thấy SPCT cho id: " + x);
                continue;
            }

            ProductDetail sanPhamCT = optionalSPCT.get();
            int soLuongConLai = sanPhamCT.getQuantity() - gioHangChiTiet.getQuantity();
            if (soLuongConLai < 0) {
                System.out.println("Số lượng sản phẩm không đủ.");
                continue;
            }

            sanPhamCT.setQuantity(soLuongConLai);
            spct_repository.save(sanPhamCT);

        }


        // Tạo ThanhToan mới và thiết lập mối quan hệ với HoaDon
        Payment thanhToanNew = new Payment();
        thanhToanNew.setBill(hoaDon);

        if (request.getPaymentId() == 1) { // PHuogn thuc chuyen khoan
            thanhToanNew.setTransactionNo(request.getTransactionNo()); // max giao dich
            thanhToanNew.setMethod("Chuyển khoản");
        } else {
            thanhToanNew.setTransactionNo(null);
            thanhToanNew.setMethod("Tiền mặt");
        }


        // Tính tổng tiền thanh toán = tổng tiền + phí ship - số tiền được giảm
        BigDecimal tongTienThanhToan = hoaDon.getTotalMoney()
                .add(hoaDon.getShippingFee())
                .subtract(hoaDon.getDiscountAmount());

        // Thiết lập tổng tiền thanh toán cho đối tượng thanhToan
        thanhToanNew.setTotalMoney(tongTienThanhToan);
        thanhToanNew.setStatus("Hoàn thành");
        thanhToanNew.setCreatedAt(hoaDon.getCreatedAt());
        thanhToanNew.setUpdatedAt(hoaDon.getUpdatedAt());
//        thanhToanNew.setNo(hoaDon.getGhiChu());
//        thanhToanNew.setD(true);

        // Lưu thanhToan mới
        thanhToanRepository.save(thanhToanNew);

        // Lưu lịch sử hóa đơn
        Bill_history lichSuHoaDon = new Bill_history();
        lichSuHoaDon.setBill(hoaDon);
        lichSuHoaDon.setEmployee(null);
        lichSuHoaDon.setStatus("Chờ xác nhận");
        lichSuHoaDon.setActionDescription(hoaDon.getNote());
        lichSuHoaDon.setCreatedAt(request.getCreatedAt());
        lichSuHoaDon.setUpdatedAt(request.getUpdatedAt());
        lichSuHoaDonRepository.save(lichSuHoaDon);


        // Tạo nội dung chi tiết đơn hàng

        StringBuilder orderDetails = new StringBuilder();
        int stt = 1;

        for (Bill_detail chiTiet : hoaDonChiTietRepository.findByBill(hoaDon)) {
            String tenSanPham = chiTiet.getProductDetail().getProduct().getName();
            String mauSac = chiTiet.getProductDetail().getColor().getName();
            String kichCo = chiTiet.getProductDetail().getSize().getName();
            int soLuong = chiTiet.getQuantity();
            BigDecimal donGia = chiTiet.getPrice();
            BigDecimal thanhTien = donGia.multiply(BigDecimal.valueOf(soLuong));

            orderDetails.append(String.format("""
                            <tr>
                                <td>%d</td>
                                <td>%s</td>
                                <td>%s - %s</td>
                                <td>%d</td>
                                <td>%s VND</td>
                                <td>%s VND</td>
                            </tr>
                            """, stt, tenSanPham, mauSac, kichCo, soLuong,
                    FormatCurrency.format(donGia), FormatCurrency.format(thanhTien)));
            stt++;
        }

        // Tạo nội dung email
        String emailContent = String.format("""
                        <!DOCTYPE html>
                        <html lang='vi'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <title>Email Đặt Hàng</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 0;
                                    background-color: #f5f5f5;
                                }
                                .container {
                                    width: 100%%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    background-color: #fff;
                                    border-radius: 10px;
                                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                                    padding: 20px;
                                    border: 1px solid #6A0DAD;
                                    position: relative;
                                }
                                .header {
                                    position: relative;
                                    text-align: center;
                                    background-color: #6A0DAD;
                                    color: white;
                                    padding: 10px;
                                    border-radius: 10px 10px 0 0;
                                   
                                }
                                .header h1 {
                                    margin: 0;
                                    font-size: 24px;
                                }
                                .qr-code {
                                    text-align: center;
                                    margin-top: 10px;
                                }
                                .email-content {
                                    padding: 20px;
                                    background-color: white;
                                    border-radius: 10px;
                                }
                                .email-content p {
                                    font-size: 14px;
                                    color: #333;
                                    line-height: 1.6;
                                }
                                .order-info, .order-details {
                                    width: 100%%;
                                    margin-bottom: 20px;
                                    border-collapse: collapse;
                                }
                                .order-info th, .order-details th,
                                .order-info td, .order-details td {
                                    padding: 10px;
                                    text-align: left;
                                    border: 1px solid #ddd;
                                    font-size: 14px;
                                }
                                .order-info th, .order-details th {
                                    background-color: #f7f7f7;
                                }
                                .order-details th {
                                    font-size: 16px;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 10px;
                                    background-color: #f1f1f1;
                                    color: grey;
                                    font-size: 12px;
                                    border-radius: 0 0 10px 10px;
                                }
                                .highlight {
                                    color: #ff5722;
                                }
                                .text {
                                    text-align: center;
                                    margin: 20px 0;
                                }
                                .text-w {
                                    text-align: center;
                                    margin: 5px 0;
                                }
                                .text-w p {
                                    color: red;
                                }
                                .track-link {
                                    color: blue;
                                    text-decoration: underline;
                                }
                                 .qr-code {
                                        position: absolute;                            
                                        top: 10px; /* Điều chỉnh khoảng cách từ trên cùng */
                                        right: 10px; /* Điều chỉnh khoảng cách từ bên phải */
                                        width: 80px;  /* Đặt kích thước nhỏ hơn cho mã QR */
                                        height: 80px;                                      
                                    }
                            </style>
                        </head>
                        <body>
                            <div class='container'>
                                <div class='header'>
                                    <h1>Cảm ơn bạn đã mua hàng tại Berry Store!</h1>                               
                                        <img src='cid:qrCodeImage' alt='QR Code' class='qr-code' />                          
                                </div>
                                <div class='email-content'>
                                    <p>Kính gửi: <strong>%s</strong>,</p>
                                    <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại Berry Store. Dưới đây là thông tin chi tiết về đơn hàng của bạn:</p>

                                    <h3>Thông tin hóa đơn</h3>
                                    <table class='order-info'>
                                        <tr>
                                            <th>Mã hóa đơn</th>
                                            <td>%s</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày đặt hàng</th>
                                            <td>%s</td>
                                        </tr>
                                        <tr>
                                            <th>Tổng số tiền</th>
                                            <td><span class='highlight'>%s VND</span></td>
                                        </tr>
                                    </table>

                                    <h3>Chi tiết đơn hàng</h3>
                                    <table class='order-details'>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Thông tin sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Giá bán</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                        %s
                                    </table>

                                    <div class='text'>
                                        <p>Đơn hàng của bạn đang được xử lý và sẽ được giao đến bạn trong thời gian sớm nhất.</p>
                                        <p>Thông tin đơn hàng bạn sẽ xem <a href='http://localhost:3000/tracking/%s' class='track-link'>Tại đây</a>.</p>
                                        <div class='text-w'>
                                            <p style="font-weight: bold;">Lưu ý:</p>
                                            <p>Nếu sản phẩm gặp vấn đề khi nhận hàng, khách hàng có thể trả hàng trong vòng 3 ngày.</p>
                                            <p>Chỉ thực hiện trả hàng cho những sản phẩm không áp dụng khuyến mại.</p>
                                            <p>Những sản phẩm được đánh dấu (*) ở giá bán là những sản phẩm đã có giảm giá khuyến mại.</p>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class='text'>
                                        <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                                        <p>Hotline: <strong>0393977745</strong></p>
                                        <p>Trường cao đẳng FPT Polytechnic, P.Trịnh Văn Bô, P.Phương Canh, Q.Nam Từ Liêm, TP.Hà Nội</p>
                                        <p>Trân trọng,</p>
                                        <p><strong>Berry Store</strong></p>
                                    </div>
                                </div>
                                <div class='footer'>
                                    <p>Email này là tự động. Vui lòng không trả lời email này.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                hoaDon.getCustomer().getFullName(),
                hoaDon.getCode(),
                hoaDon.getCreatedAt(),
                FormatCurrency.format(hoaDon.getTotalMoney().add(hoaDon.getShippingFee()).subtract(hoaDon.getDiscountAmount())),
                orderDetails.toString(),
                hoaDon.getCode());


        try {
            String qrCodeText = "http://localhost:3000/tracking/" + hoaDon.getCode();
            byte[] qrCodeImage = QRCodeGenerator.getQRCodeImage(qrCodeText, 200, 200);

            // Gửi mã QR dưới dạng FileSystemResource
            File qrCodeFile = File.createTempFile("qrCode", ".png");
            try (FileOutputStream fos = new FileOutputStream(qrCodeFile)) {
                fos.write(qrCodeImage);
            }

            mailUtils.sendEmail(hoaDon.getRecipientEmail(), "Thông Báo Hóa Đơn Đặt Hàng", emailContent, qrCodeFile.getPath());

        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return new ResponseObject("Lỗi khi tạo mã QR");
        }


        return new ResponseObject(hoaDon);
    }


    @Override
    public ResponseObject update(Integer id, GioHangRequest request) {
        return null;

    }

    public ResponseObject createDiaChi(DiaChiRequest request) {
        if (request == null || request.getCustomerId() == null || request.getFullName() == null ||
                request.getPhoneNumber() == null || request.getCity() == null || request.getDistrict() == null ||
                request.getWard() == null || request.getDetailedAddress() == null) {
            throw new IllegalArgumentException("Dữ liệu không hợp lệ.");
        }

        Customer customer = khachHangRepository.findById(request.getCustomerId()).get();

        // Tạo đối tượng Address từ request
        Address diaChi = new Address();
        diaChi.setCustomer(customer);
        diaChi.setFullName(request.getFullName());
        diaChi.setPhoneNumber(request.getPhoneNumber());
        diaChi.setDefaultAddress(false);
        diaChi.setCity(request.getCity());
        diaChi.setDistrict(request.getDistrict());
        diaChi.setWard(request.getWard());
        diaChi.setDetailedAddress(request.getDetailedAddress());
        diaChi.setCreatedAt(LocalDateTime.now());
        diaChi.setUpdatedAt(LocalDateTime.now());
        diaChi.setStatus("Hoạt động");
        diaChi.setDeleted(false);

        // Lưu đối tượng DiaChi vào cơ sở dữ liệu
        Address savedDiaChi = diaChiRepository.save(diaChi);

        // Trả về ResponseObject với đối tượng DiaChi đã lưu
        return new ResponseObject(savedDiaChi);
    }

    @Override
    public Address updateDiaChiMD(Integer idDC) {
        // Lấy địa chỉ được chọn theo id
        Address selectedDiaChi = diaChiRepository.findById(idDC).orElse(null);

        if (selectedDiaChi != null) {
            // Lấy tất cả các địa chỉ khác của khách hàng
            List<Address> allDiaChi = diaChiRepository.findAllByIdKhachHang(selectedDiaChi.getCustomer().getId());

            // Cập nhật tất cả các địa chỉ thành không mặc định
            for (Address diaChi : allDiaChi) {
                if (diaChi.getId().equals(idDC)) {
                    // Địa chỉ được chọn đặt làm mặc định
                    diaChi.setDefaultAddress(true); // no la 0
                } else {
                    // Các địa chỉ khác không là mặc định
                    diaChi.setDefaultAddress(false);// no la 1
                }
                // Lưu lại mỗi địa chỉ sau khi cập nhật
                diaChiRepository.save(diaChi);
            }

            return selectedDiaChi;
        } else {
            return null;
        }
    }


    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject updateSoLuong(Integer idGioHangCT, GioHangRequest request) {
        // Tìm chi tiết giỏ hàng dựa trên idGioHangCT
        Cart_detail gioHangChiTiet = gioHangChiTietRepository.findById(idGioHangCT)
                .orElseThrow(() -> new RestApiException("Chi tiết giỏ hàng không tồn tại"));

        // Cập nhật số lượng
        gioHangChiTiet.setQuantity(request.getQuantity());

        gioHangChiTietRepository.save(gioHangChiTiet);

        return new ResponseObject(gioHangChiTiet);
    }

    @Override
    public List<SanPhamRequest> search(String key) {

        // Tìm kiếm danh sách sản phẩm chi tiết từ kho mục tiêu của nó để lấy ra những idSanPham
        List<ProductDetail> spctList = gioHangRepository.searchSPKey(key);

        // Sử dụng Map để nhóm các SPCT theo idSanPham và chỉ giữ lại 1 SPCT cho mỗi idSanPham
        Map<Integer, ProductDetail> spctByProductId = spctList.stream()
                .collect(Collectors.toMap(
                        spct -> spct.getProduct().getId(),  // Nhóm theo idSanPham
                        spct -> spct,                         // Giữ lại đối tượng SPCT đầu tiên
                        (existing, replacement) -> existing   // Nếu trùng idSanPham, giữ lại SPCT đầu tiên
                ));

        // Lấy danh sách ID sản phẩm từ SPCT (đã loại bỏ trùng lặp)
        List<Integer> productIds = new ArrayList<>(spctByProductId.keySet());

        // Tìm danh sách sản phẩm từ danh sách ID
        List<Product> sanPhamList = sanPhamRepository.findByIds(productIds);  // Phương thức tìm theo danh sách ID

        // Khởi tạo danh sách chứa SanPhamRequest
        List<SanPhamRequest> sanPhamRequestList = new ArrayList<>();

        // Lặp qua từng sản phẩm và tạo SanPhamRequest tương ứng
        for (Product sp : sanPhamList) {
            // Lấy tất cả SPCT cho sản phẩm này
            List<ProductDetail> spList = spctList.stream()
                    .filter(spct -> spct.getProduct().getId().equals(sp.getId()))  // Lọc ra các SPCT cho sản phẩm hiện tại
                    .collect(Collectors.toList());

            // Nhóm các SPCT theo tiêu chí thương hiệu, chất liệu, cổ áo, tay áo
            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();

            for (ProductDetail spct : spList) {
                // Tạo khóa để nhóm theo thương hiệu, chất liệu, cổ áo, tay áo
                String mainKey = spct.getBrand().getId() + "-" +
                        spct.getMaterial().getId() + "-" +
                        spct.getCollar().getId() + "-" +
                        spct.getSleeve().getId();

                // Nhóm các SPCT lại với nhau
                groupedSPCT.computeIfAbsent(mainKey, k -> new ArrayList<>()).add(spct);
            }

            // Tạo một SanPhamRequest cho từng nhóm SPCT đã gom
            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
                List<ProductDetail> spctGroup = entry.getValue();
                // Khởi tạo đối tượng SanPhamRequest cho sản phẩm này
                SanPhamRequest sanPhamRequest = new SanPhamRequest();
                sanPhamRequest.setId(sp.getId());
                sanPhamRequest.setCode(sp.getCode());
                sanPhamRequest.setName(sp.getName());
                sanPhamRequest.setQuantity(sp.getQuantity());
                sanPhamRequest.setCategory(sp.getCategory());
                sanPhamRequest.setStatus(sp.getStatus());
                sanPhamRequest.setCreatedAt(sp.getCreatedAt());
                sanPhamRequest.setUpdatedAt(sp.getUpdatedAt());
                sanPhamRequest.setCreatedBy(sp.getCreatedBy());
                sanPhamRequest.setUpdatedBy(sp.getUpdatedBy());

                // Gán danh sách SPCT đã nhóm vào SanPhamRequest
                sanPhamRequest.setListProductDetails(spctGroup);

                // Thêm SanPhamRequest vào danh sách kết quả
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        // Trả về danh sách kết quả
        return sanPhamRequestList;
    }

    @Override
    public List<SanPhamRequest> findFilteredSearchProducts(String key, Integer idMS, Integer idTH, Integer idKC, String priceRange, String sort) {
        // Tìm kiếm danh sách sản phẩm chi tiết từ kho theo key
        List<ProductDetail> spctList = gioHangRepository.searchSPKey(key);

        // Sử dụng Map để nhóm các SPCT theo idSanPham và chỉ giữ lại 1 SPCT cho mỗi idSanPham
        Map<Integer, ProductDetail> spctByProductId = spctList.stream()
                .collect(Collectors.toMap(
                        spct -> spct.getProduct().getId(),  // Nhóm theo idSanPham
                        spct -> spct,                         // Giữ lại đối tượng SPCT đầu tiên
                        (existing, replacement) -> existing   // Nếu trùng idSanPham, giữ lại SPCT đầu tiên
                ));

        // Lấy danh sách ID sản phẩm từ SPCT (đã loại bỏ trùng lặp)
        List<Integer> productIds = new ArrayList<>(spctByProductId.keySet());

        // Tìm danh sách sản phẩm từ danh sách ID
        List<Product> sanPhamList = sanPhamRepository.findByIds(productIds);

        // Khởi tạo danh sách chứa SanPhamRequest
        List<SanPhamRequest> sanPhamRequestList = new ArrayList<>();

        // Lặp qua từng sản phẩm và tạo SanPhamRequest tương ứng
        for (Product sp : sanPhamList) {
            // Lấy tất cả SPCT cho sản phẩm này
            List<ProductDetail> spList = spctList.stream()
                    .filter(spct -> spct.getProduct().getId().equals(sp.getId()))  // Lọc ra các SPCT cho sản phẩm hiện tại
                    .collect(Collectors.toList());

            // Nhóm các SPCT theo tiêu chí thương hiệu, chất liệu, cổ áo, tay áo
            Map<String, List<ProductDetail>> groupedSPCT = new HashMap<>();

            for (ProductDetail spct : spList) {
                // Tạo khóa để nhóm theo thương hiệu, chất liệu, cổ áo, tay áo
                String mainKey = spct.getBrand().getId() + "-" +
                        spct.getMaterial().getId() + "-" +
                        spct.getCollar().getId() + "-" +
                        spct.getSleeve().getId();

                // Nhóm các SPCT lại với nhau
                groupedSPCT.computeIfAbsent(mainKey, k -> new ArrayList<>()).add(spct);
            }

            // Tạo một SanPhamRequest cho từng nhóm SPCT đã gom
            for (Map.Entry<String, List<ProductDetail>> entry : groupedSPCT.entrySet()) {
                List<ProductDetail> spctGroup = entry.getValue();

                // Khởi tạo đối tượng SanPhamRequest cho sản phẩm này
                SanPhamRequest sanPhamRequest = new SanPhamRequest();
                sanPhamRequest.setId(sp.getId());
                sanPhamRequest.setCode(sp.getCode());
                sanPhamRequest.setName(sp.getName());
                sanPhamRequest.setQuantity(sp.getQuantity());
                sanPhamRequest.setCategory(sp.getCategory());
                sanPhamRequest.setStatus(sp.getStatus());
                sanPhamRequest.setCreatedAt(sp.getCreatedAt());
                sanPhamRequest.setUpdatedAt(sp.getUpdatedAt());
                sanPhamRequest.setCreatedBy(sp.getCreatedBy());
                sanPhamRequest.setUpdatedBy(sp.getUpdatedBy());


                // Gán danh sách SPCT đã nhóm vào SanPhamRequest
                sanPhamRequest.setListProductDetails(spctGroup);

                // Thêm SanPhamRequest vào danh sách kết quả
                sanPhamRequestList.add(sanPhamRequest);
            }
        }

        // Lọc theo các điều kiện bổ sung: màu sắc, kích cỡ, giá cả
        sanPhamRequestList.forEach(sanPham -> {
            List<ProductDetail> filteredSPCTList = sanPham.getListProductDetails().stream()
                    .filter(spct -> (idMS == null || (spct.getColor() != null && spct.getColor().getId().equals(idMS))))  // Lọc theo màu sắc
                    .filter(spct -> (idTH == null || (spct.getBrand() != null && spct.getBrand().getId().equals(idTH))))  // Lọc theo thương hiệu
                    .filter(spct -> (idKC == null || (spct.getSize() != null && spct.getSize().getId().equals(idKC))))  // Lọc theo kích cỡ
                    .filter(spct -> {
                        if (priceRange == null) return true;  // Nếu không có lọc giá, bỏ qua
                        BigDecimal price = (spct.getDiscountPrice() != null && spct.getDiscountPrice().compareTo(BigDecimal.ZERO) != 0)
                                ? spct.getDiscountPrice() : spct.getPrice();
                        if (price == null) return false; // Nếu giá cũng null, không thỏa mãn
                        switch (priceRange) {
                            case "under300":
                                return price.compareTo(new BigDecimal("300000")) < 0;
                            case "300to700":
                                return price.compareTo(new BigDecimal("300000")) >= 0 && price.compareTo(new BigDecimal("700000")) <= 0;
                            case "above700":
                                return price.compareTo(new BigDecimal("700000")) > 0;
                            default:
                                return true;
                        }
                    })
                    .collect(Collectors.toList());

            sanPham.setListProductDetails(filteredSPCTList); // Cập nhật danh sách SPCT sau khi lọc
        });

        // Sắp xếp theo điều kiện sort
        if (sort != null) {
            switch (sort) {
                case "price-asc":
                    sanPhamRequestList.sort(Comparator.comparing(
                            (SanPhamRequest sp) -> {
                                if (sp.getListProductDetails() != null && !sp.getListProductDetails().isEmpty()) {
                                    ProductDetail firstSPCT = sp.getListProductDetails().get(0);
                                    BigDecimal discountPercentage = BigDecimal.valueOf(firstSPCT.getDiscountPercentage());
                                    BigDecimal gia = (firstSPCT.getDiscountPrice() != null && discountPercentage.compareTo(BigDecimal.ZERO) != 0)
                                            ? firstSPCT.getDiscountPrice()
                                            : firstSPCT.getPrice();
                                    return gia != null ? gia : BigDecimal.ZERO;
                                }
                                return BigDecimal.ZERO; // Trả về giá trị mặc định nếu danh sách trống
                            },
                            Comparator.nullsLast(Comparator.naturalOrder()) // Sử dụng Comparator.nullsLast cho giá trị null
                    ));

                    break;

                case "price-desc":
                    sanPhamRequestList.sort(Comparator.comparing(
                            (SanPhamRequest sp) -> {
                                if (sp.getListProductDetails() != null && !sp.getListProductDetails().isEmpty()) {
                                    ProductDetail firstSPCT = sp.getListProductDetails().get(0);
                                    BigDecimal discountPercentage = BigDecimal.valueOf(firstSPCT.getDiscountPercentage());
                                    BigDecimal gia = (firstSPCT.getDiscountPrice() != null && discountPercentage.compareTo(BigDecimal.ZERO) != 0)
                                            ? firstSPCT.getDiscountPrice()
                                            : firstSPCT.getPrice();

                                    return gia != null ? gia : BigDecimal.ZERO;
                                }
                                return BigDecimal.ZERO; // Trả về giá trị mặc định nếu danh sách trống
                            },
                            Comparator.nullsLast(Comparator.naturalOrder())
                    ).reversed());
                    break;
//                getListSPCT
                case "newest":
                    sanPhamRequestList.sort(Comparator.comparing(
                            (SanPhamRequest sp) -> {
                                if (sp.getListProductDetails() != null && !sp.getListProductDetails().isEmpty()) {
                                    return sp.getListProductDetails().get(0).getCreatedAt();
                                }
                                return null; // Trả về null nếu danh sách trống
                            },
                            Comparator.nullsLast(Comparator.naturalOrder())
                    ).reversed());
                    break;
            }
        }

        // Trả về danh sách kết quả
        return sanPhamRequestList;
    }


    @Override
    public List<Voucher> getAllByPublic() {
        LocalDateTime ngayHienTai = LocalDateTime.now(); // Lấy thời gian hiện tại
        List<Voucher> listP = phieuGiamGiaRepository.findAllByPublic("Cộng đồng", ngayHienTai); // Truyền vào tham số ngày hiện tại
        return listP;
    }

    @Override
    public Voucher selectedPhieuGiamGia(Integer idPhieuGiamGia) {
        Voucher phieuGiamGia = phieuGiamGiaRepository.findById(idPhieuGiamGia).get();
        return phieuGiamGia;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject delete(Integer id) {
        // Tìm chi tiết giỏ hàng cần xóa
        Cart_detail gioHangCT = gioHangChiTietRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Chi tiết giỏ hàng không tồn tại"));

        // Tìm sản phẩm chi tiết liên quan đến chi tiết giỏ hàng
        ProductDetail spct = spct_repository.findById(gioHangCT.getProductDetail().getId())
                .orElseThrow(() -> new RestApiException("Sản phẩm không tồn tại"));

        // Tăng số lượng sản phẩm trở lại sau khi xóa chi tiết giỏ hàng
//        spct.setSoLuong(spct.getSoLuong() + gioHangCT.getSoLuong());

        // Lưu thay đổi số lượng sản phẩm vào cơ sở dữ liệu
//        spct_repository.save(spct);

        // Xóa chi tiết giỏ hàng
        gioHangChiTietRepository.delete(gioHangCT);

        // Trả về đối tượng chi tiết giỏ hàng đã bị xóa
        return new ResponseObject(gioHangCT);
    }


    @Override
    public KhachHangRequest detail(Integer idKH) {
        List<Address> listDiaChi = diaChiRepository.findAllByIdKhachHang(idKH);
        Customer khachHang = khachHangRepository.findById(idKH)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại với id: " + idKH));

        KhachHangRequest khachHangRequest = new KhachHangRequest();
        khachHangRequest.setCode(khachHang.getCode());
        khachHangRequest.setPhoneNumber(khachHang.getPhoneNumber());
        khachHangRequest.setNote(khachHang.getNote());
        khachHangRequest.setStatus(khachHang.getStatus());
        khachHangRequest.setDeleted(khachHang.getDeleted());
        khachHangRequest.setAccount(khachHang.getAccount());
        khachHangRequest.setDateOfBirth(khachHang.getDateOfBirth());
        khachHangRequest.setFullName(khachHang.getFullName());
        khachHangRequest.setEmail(khachHang.getEmail());
        khachHangRequest.setListAddress(listDiaChi);

        khachHangRequest.setImageStr(khachHang.getImage());

        khachHangRequest.setGender(khachHang.getGender());
        khachHangRequest.setCreatedAt(khachHang.getCreatedAt());
        khachHangRequest.setUpdatedAt(khachHang.getUpdatedAt());
        khachHangRequest.setCreatedBy(khachHang.getCreatedBy());
        khachHangRequest.setUpdatedBy(khachHang.getUpdatedBy());

        return khachHangRequest;
    }

    @Override
    public Address selectedDiaChi(Integer idDC) {
        Address diaChi = diaChiRepository.findById(idDC).get();
        return diaChi;
    }

    @Override
    @Transactional
    public ResponseObject deleteAll() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        List<Cart_detail> gioHangChiTietListDelete = gioHangChiTietRepository.findAllByCreatedAtBefore(oneWeekAgo);

        // Kiểm tra nếu không có giỏ hàng cần xóa
        if (gioHangChiTietListDelete.isEmpty()) {
            return new ResponseObject("Không có giỏ hàng nào cần xóa.");
        }

        try {
            // Xóa các chi tiết giỏ hàng
            gioHangChiTietRepository.deleteAll(gioHangChiTietListDelete);
        } catch (Exception e) {
            throw new RestApiException("Xóa giỏ hàng thất bại: " + e.getMessage());
        }

        return new ResponseObject("Đã xóa " + gioHangChiTietListDelete.size() + " giỏ hàng và các chi tiết giỏ hàng liên quan.");
    }


    @Override
    public List<Voucher> getAllByCaNhan(Integer idKH) {
        LocalDateTime ngayHienTai = LocalDateTime.now(); // Lấy thời gian hiện tại
        List<Voucher> listP = phieuGiamGiaRepository.findAllByCaNhan(idKH, "Cá nhân", ngayHienTai); // Truyền vào tham số ngày hiện tại
        return listP;
    }

    @Override
    public Voucher detailVoucher(Integer idP) {
        Voucher phieuGiamGia = phieuGiamGiaRepository.findById(idP).get(); // Truyền vào tham số ngày hiện tại
        return phieuGiamGia;

    }

    @Override
    public List<HoaDonRequest> getAllDonMua(Integer idKH) {
        // Lấy danh sách hóa đơn từ repository
        List<Bill> hoaDons = hoaDonRepository.getAllDonMuaByIdKH(idKH);

        // Tạo danh sách để chứa kết quả trả về
        List<HoaDonRequest> hoaDonRequests = new ArrayList<>();

        // Duyệt qua từng hóa đơn
        for (Bill hoaDon : hoaDons) {
            // Lấy danh sách chi tiết hóa đơn cho từng hóa đơn
            List<Bill_detail> hoaDonChiTiets = hoaDonChiTietRepository.findByBill(hoaDon);

            // Tạo mới một đối tượng HoaDonRequest
            HoaDonRequest hoaDonRequest = new HoaDonRequest();

            // Thiết lập các giá trị từ HoaDon cho HoaDonRequest
            hoaDonRequest.setId(hoaDon.getId());
            hoaDonRequest.setCode(hoaDon.getCode());
            hoaDonRequest.setAddress(hoaDon.getAddress());
            hoaDonRequest.setNote(hoaDon.getNote());
            hoaDonRequest.setCreatedAt(hoaDon.getCreatedAt());
            hoaDonRequest.setInvoiceType(hoaDon.getInvoiceType());
            hoaDonRequest.setCustomerId(hoaDon.getCustomer().getId());
            hoaDonRequest.setInvoiceStatus(hoaDon.getInvoiceStatus());
            hoaDonRequest.setShippingFee(hoaDon.getShippingFee());
            hoaDonRequest.setTotalMoney(hoaDon.getTotalMoney());
            hoaDonRequest.setDiscountAmount(hoaDon.getDiscountAmount());
            hoaDonRequest.setConfirmationDate(hoaDon.getConfirmationDate());
            hoaDonRequest.setShippingTime(hoaDon.getShippingTime());
//            hoaDonRequest.setMaGiaoDich(hoaDon.getMaGiaoDich());
            hoaDonRequest.setReceivedDate(hoaDon.getReceivedDate());
            hoaDonRequest.setDeliveryDate(hoaDon.getDeliveryDate());
            hoaDonRequest.setRecipientName(hoaDon.getRecipientName());
            hoaDonRequest.setRecipientPhone(hoaDon.getRecipientPhone());
            hoaDonRequest.setVoucher(hoaDon.getVoucher());
            hoaDonRequest.setRecipientEmail(hoaDon.getRecipientEmail());
            hoaDonRequest.setUpdatedAt(hoaDon.getUpdatedAt());
            hoaDonRequest.setEmployee(hoaDon.getEmployee());

            // Thiết lập danh sách chi tiết hóa đơn
            hoaDonRequest.setBillDetails(hoaDonChiTiets);

            // Thêm vào danh sách kết quả
            hoaDonRequests.add(hoaDonRequest);
        }

        // Trả về danh sách hóa đơn yêu cầu
        return hoaDonRequests;

    }

}
