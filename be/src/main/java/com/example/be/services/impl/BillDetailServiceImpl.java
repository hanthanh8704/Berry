package com.example.be.services.impl;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.services.BillDetailService;
import com.example.be.services.client.CartService;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.*;
import com.example.be.utils.converter.BillDetailConvert;
import com.example.be.utils.exception.RestApiException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

/**
 * @author hanthanh
 */
@Service
@Transactional
public class BillDetailServiceImpl implements BillDetailService {

    private final BillRepository hoaDonRepository;
    private final BillDetailRepository hoaDonChiTietRepository;
    private final ProductDetailPromotionRepository dotGiamGiaDetailRepository;
    private final ShirtDetailRepository chiTietSanPhamRepository;
    private final BillHistoryRepository lichSuHoaDonRepository;
    private final BillDetailConvert billDetailConvert;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private PaymentRepository paymentRepository;

    public BillDetailServiceImpl(BillRepository hoaDonRepository, BillDetailRepository hoaDonChiTietRepository, ProductDetailPromotionRepository dotGiamGiaDetailRepository, ShirtDetailRepository chiTietSanPhamRepository, BillHistoryRepository lichSuHoaDonRepository, BillDetailConvert billDetailConvert) {
        this.hoaDonRepository = hoaDonRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.dotGiamGiaDetailRepository = dotGiamGiaDetailRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.lichSuHoaDonRepository = lichSuHoaDonRepository;
        this.billDetailConvert = billDetailConvert;
    }

    //
//    @Override
//    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
//        return new PageableObject<>(hoaDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
//    }
    @Override
    public List<BillDetail> findByHoaDonId(Integer idBill) {
        return hoaDonChiTietRepository.findByHoaDonId(idBill);
    }

    @Override
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonChiTietRepository.getAllHDCT(request, pageable));
    }

    @Override
    public BillDetail getOne(Integer id) {
        return hoaDonChiTietRepository.findById(id).orElse(null);
    }

//    @Override
//    public BillDetail create(BillDetailRequest request) {
//        /**
//         * convertRequestToEntity(request): Chuyển đổi request thành entity BillDetail.
//         * findByDetailCode: Lấy thông tin sản phẩm từ cơ sở dữ liệu dựa trên detailCode.
//         */
//
//        BillDetail hdct = billDetailConvert.convertRequestToEntity(request);
//        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
//        // Cập nhật tổng tiền hóa đơn
//        /**
//         * Lấy hóa đơn và kiểm tra số lượng
//         * Lấy hóa đơn: Tìm hóa đơn từ cơ sở dữ liệu dựa trên idBill. Nếu không tìm thấy, ném ngoại lệ.
//         * Kiểm tra số lượng:
//         * Nếu số lượng nhỏ hơn 1: ném ngoại lệ.
//         * Nếu số lượng lớn hơn số lượng tồn kho (ctsp.getQuantity()): ném ngoại lệ.
//         */
//
//        Bill hoaDon = hoaDonRepository.findById(request.getIdBill())
//                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + request.getIdBill()));
//        if (request.getQuantity() < 1) {
//            throw new RestApiException("Số lượng phải lớn hơn 1!");
//        } else if (request.getQuantity() > ctsp.getQuantity()) {
//            throw new RestApiException("Quá số lượng cho phép!");
//        }
//        /**
//         * Cập nhật số lượng tồn kho
//         * Trừ số lượng sản phẩm trong yêu cầu khỏi số lượng tồn kho.
//         * Lưu lại trạng thái mới của sản phẩm vào cơ sở dữ liệu.
//         */
//
//        ctsp.setQuantity(ctsp.getQuantity() - request.getQuantity());
//        chiTietSanPhamRepository.save(ctsp);
//
//        /**
//         * Lấy danh sách các chi tiết hóa đơn có sản phẩm và hóa đơn tương ứng.
//         * Chọn chi tiết hóa đơn đầu tiên (nếu tồn tại).
//         */
////        // Kiểm tra sản phẩm trong giỏ hàng
////        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(
////                request.getDetailCode(), request.getIdBill());
////        BillDetail exHDCT = null;
////
////
////
////        /**
////         * Cập nhật chi tiết hóa đơn nếu đã tồn tại
////         * Cộng số lượng mới vào chi tiết hóa đơn hiện tại.
////         * Lưu chi tiết hóa đơn đã cập nhật và trả về kết quả.
////         */
////
////
////        if (exHDCT != null) {
////
////            /**
////             * Kiểm tra sản phẩm trong giỏ hàng tách bản ghi nếu giá cập nhật
////             */
////
////            if (exHDCTList != null && !exHDCTList.isEmpty()) {
////                // Nếu tồn tại bản ghi trong giỏ hàng
////                if (exHDCTList.size() == 1) {
////                    // Nếu chỉ có một bản ghi, lấy bản ghi đó
////                    hdct = exHDCTList.get(0);
////                } else {
////                    // Nếu có nhiều hơn một bản ghi, lấy bản ghi mới nhất (ngày tạo sớm nhất)
////                    hdct = exHDCTList.stream()
////                            .max(Comparator.comparing(BillDetail::getCreatedAt))
////                            .orElse(exHDCTList.get(0));
////                }
////
////                // Kiểm tra giá của bản ghi được chọn
////                if (hdct.getPrice().equals(ctsp.getPrice())) {
////                    // Nếu giá trùng khớp, cộng dồn số lượng
////                    hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
////                    hoaDonChiTietRepository.save(hdct);
////                } else {
////                    // Nếu giá khác, tạo một bản ghi mới
////                    BillDetail newBillDetail = new BillDetail();
////                    newBillDetail.setBill(hoaDon);
////                    newBillDetail.setProductDetail(ctsp);
////                    newBillDetail.setQuantity(request.getQuantity());
////                    newBillDetail.setPrice(ctsp.getPrice());
////                    newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
////                    newBillDetail.setPromotion(ctsp.getDiscountPercentage());
////
////                    hoaDonChiTietRepository.save(newBillDetail);
////                }
////            }
////
////        } else {
////            /**
////             * Tạo chi tiết hóa đơn mới nếu chưa tồn tại
////             * Gán các thuộc tính:
////             * Giá: Dựa vào giá sản phẩm hoặc giá sau khi giảm giá.
////             * Số lượng: Lấy từ request.
////             * Khuyến mãi: Lấy từ thông tin sản phẩm.
////             * Trạng thái: CHO_XAC_NHAN.
////             * Lưu chi tiết hóa đơn mới vào cơ sở dữ liệu.
////             */
////
////            hdct.setPrice(ctsp.getDiscountPercentage() == 0 ? ctsp.getPrice() : ctsp.getDiscountPrice());
////            hdct.setQuantity(request.getQuantity());
////            hdct.setPromotion(ctsp.getDiscountPercentage());
////            hdct.setStatus(StatusBill.CHO_XAC_NHAN);
////            BillDetail saveHDCT = hoaDonChiTietRepository.save(hdct);
//// Kiểm tra sản phẩm trong giỏ hàng
//        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(
//                request.getDetailCode(), request.getIdBill());
//        BillDetail hdct = null;
//
//// Nếu tồn tại bản ghi trong giỏ hàng
//        if (exHDCTList != null && !exHDCTList.isEmpty()) {
//            if (exHDCTList.size() == 1) {
//                // Nếu chỉ có một bản ghi, lấy bản ghi đó
//                hdct = exHDCTList.get(0);
//            } else {
//                // Nếu có nhiều hơn một bản ghi, lấy bản ghi mới nhất (ngày tạo sớm nhất)
//                hdct = exHDCTList.stream()
//                        .max(Comparator.comparing(BillDetail::getCreatedAt))
//                        .orElse(exHDCTList.get(0));
//            }
//
//            // Kiểm tra giá của bản ghi được chọn
//            if (hdct.getPrice().equals(ctsp.getPrice())) {
//                // Nếu giá trùng khớp, cộng dồn số lượng
//                hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
//                hoaDonChiTietRepository.save(hdct);
//            } else {
//                // Nếu giá khác, tạo một bản ghi mới
//                BillDetail newBillDetail = new BillDetail();
//                newBillDetail.setBill(hoaDon);
//                newBillDetail.setProductDetail(ctsp);
//                newBillDetail.setQuantity(request.getQuantity());
//                newBillDetail.setPrice(ctsp.getPrice());
//                newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
//                newBillDetail.setPromotion(ctsp.getDiscountPercentage());
//
//                hoaDonChiTietRepository.save(newBillDetail);
//            }
//        } else {
//            // Nếu không có bản ghi nào trong giỏ hàng
//            hdct = new BillDetail();
//            hdct.setBill(hoaDon);
//            hdct.setProductDetail(ctsp);
//            hdct.setQuantity(request.getQuantity());
//            hdct.setPrice(ctsp.getDiscountPercentage() == 0 ? ctsp.getPrice() : ctsp.getDiscountPrice());
//            hdct.setPromotion(ctsp.getDiscountPercentage());
//            hdct.setStatus(StatusBill.CHO_XAC_NHAN);
//
//            hoaDonChiTietRepository.save(hdct);
//        }
//
//            /**
//             *  Tính lại tổng tiền hóa đơn
//             *  Duyệt qua các chi tiết hóa đơn, tính tổng tiền dựa trên giá và số lượng.
//             * Trừ đi số tiền giảm giá (nếu có).
//             * Cập nhật tổng tiền vào hóa đơn.
//             */
//
//            hoaDon = saveHDCT.getBill();
//            if (hoaDon.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
//                BigDecimal caculateTotalMoney = BigDecimal.ZERO;
//                for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hdct.getBill().getId())) {
//                    BigDecimal donGia = x.getPrice() != null ? x.getPrice() : BigDecimal.ZERO;
//                    BigDecimal soLuong = BigDecimal.valueOf(x.getQuantity());
//                    caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
//                }
//
//                BigDecimal soTienDuocGiam = hoaDon.getDiscountAmount() != null ? hoaDon.getDiscountAmount() : BigDecimal.ZERO;
//                BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
//                hoaDon.setTotalMoney(tongTien);
//                /**
//                 * Lưu lịch sử hóa đơn (nếu cần)
//                 * Tạo một đối tượng BillHistory với thông tin hành động (thêm sản phẩm, số lượng).
//                 * Lưu vào cơ sở dữ liệu.
//                 */
//
//                if (hoaDon.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hoaDon.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hoaDon.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
//                    BillHistory lichSuHoaDon = new BillHistory();
//                    lichSuHoaDon.setBill(hoaDon);
//                    lichSuHoaDon.setActionDescription("Đã thêm " + request.getQuantity() +
//                            " sản phẩm \"" + ctsp.getProduct().getName() + " [" +
//                            (ctsp.getPrice()));
//                    lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
//                    lichSuHoaDonRepository.save(lichSuHoaDon);
//                }
//                hoaDonRepository.save(hoaDon);
//            }
//
//            return saveHDCT;
//        }
//    }


    @Override
    public BillDetail create(BillDetailRequest request) {
        // Chuyển đổi request thành entity BillDetail
        BillDetail hdct = billDetailConvert.convertRequestToEntity(request);
        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());

        // Kiểm tra hóa đơn và số lượng
        Bill hoaDon = hoaDonRepository.findById(request.getIdBill())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + request.getIdBill()));

        if (request.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > ctsp.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }

        // Cập nhật số lượng tồn kho
        ctsp.setQuantity(ctsp.getQuantity() - request.getQuantity());
        chiTietSanPhamRepository.save(ctsp);

        // Kiểm tra sản phẩm trong giỏ hàng
        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(
                request.getDetailCode(), request.getIdBill());

        // Xử lý khi đã có bản ghi trong giỏ hàng
        if (exHDCTList != null && !exHDCTList.isEmpty()) {
            // Nếu chỉ có một bản ghi, lấy bản ghi đó
            hdct = exHDCTList.size() == 1 ? exHDCTList.get(0) : exHDCTList.stream()
                    .max(Comparator.comparing(BillDetail::getCreatedAt))
                    .orElse(exHDCTList.get(0));

            // Kiểm tra giá của bản ghi được chọn
            if (hdct.getPrice().equals(ctsp.getPrice())) {
                // Nếu giá trùng khớp, cộng dồn số lượng
                hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
                hoaDonChiTietRepository.save(hdct);
            } else {
                // Nếu giá khác, tạo một bản ghi mới với giá mới
                BillDetail newBillDetail = new BillDetail();
                newBillDetail.setBill(hoaDon);
                newBillDetail.setProductDetail(ctsp);
                newBillDetail.setQuantity(request.getQuantity());
                newBillDetail.setPrice(ctsp.getPrice());
                newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
                newBillDetail.setPromotion(ctsp.getDiscountPercentage());

                hoaDonChiTietRepository.save(newBillDetail);
            }
        } else {
            // Nếu không có bản ghi nào trong giỏ hàng, tạo chi tiết hóa đơn mới
            hdct.setBill(hoaDon);
            hdct.setProductDetail(ctsp);
            hdct.setQuantity(request.getQuantity());
            hdct.setPrice(ctsp.getDiscountPercentage() == 0 ? ctsp.getPrice() : ctsp.getDiscountPrice());
            hdct.setPromotion(ctsp.getDiscountPercentage());
            hdct.setStatus(StatusBill.CHO_XAC_NHAN);

            hoaDonChiTietRepository.save(hdct);
        }

        // Tính lại tổng tiền hóa đơn
        hoaDon = hdct.getBill();
        if (hoaDon.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
            BigDecimal caculateTotalMoney = BigDecimal.ZERO;
            for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hdct.getBill().getId())) {
                BigDecimal donGia = x.getPrice() != null ? x.getPrice() : BigDecimal.ZERO;
                BigDecimal soLuong = BigDecimal.valueOf(x.getQuantity());
                caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
            }

            BigDecimal soTienDuocGiam = hoaDon.getDiscountAmount() != null ? hoaDon.getDiscountAmount() : BigDecimal.ZERO;
            BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
            hoaDon.setTotalMoney(tongTien);

            // Lưu lịch sử hóa đơn
            if (hoaDon.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hoaDon.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hoaDon.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
                BillHistory lichSuHoaDon = new BillHistory();
                lichSuHoaDon.setBill(hoaDon);
                lichSuHoaDon.setActionDescription("Đã thêm " + request.getQuantity() +
                        " sản phẩm \"" + ctsp.getProduct().getName() + " [" +
                        ctsp.getPrice() + "]");
                lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
                lichSuHoaDonRepository.save(lichSuHoaDon);
            }
            hoaDonRepository.save(hoaDon);
        }

        return hdct;
    }





    // Cũ
//    @Override
//    public BillDetail create(BillDetailRequest request) {
//        // Chuyển đổi yêu cầu từ DTO thành entity
//        BillDetail hdct = billDetailConvert.convertRequestToEntity(request);
//
//        // Tìm thông tin chi tiết sản phẩm dựa trên mã chi tiết
//        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
//
//        // Lấy thông tin hóa đơn dựa trên ID, nếu không tìm thấy, ném lỗi
//        Bill hoaDon = hoaDonRepository.findById(request.getIdBill())
//                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + request.getIdBill()));
//
//        // Kiểm tra số lượng sản phẩm hợp lệ
//        if (request.getQuantity() < 1) {
//            throw new RestApiException("Số lượng phải lớn hơn 1!");
//        } else if (request.getQuantity() > ctsp.getQuantity()) {
//            throw new RestApiException("Quá số lượng cho phép!");
//        }
//
//        // Cập nhật lại số lượng sản phẩm trong kho
//        ctsp.setQuantity(ctsp.getQuantity() - request.getQuantity());
//        chiTietSanPhamRepository.save(ctsp);
//
//        // Kiểm tra xem sản phẩm đã tồn tại trong hóa đơn chi tiết chưa
//        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(
//                request.getDetailCode(), request.getIdBill(), request.getPrice());
//        BillDetail exHDCT = null;
//
//        // Nếu danh sách sản phẩm trong hóa đơn chi tiết không rỗng, lấy phần tử đầu tiên
//        if (exHDCTList != null && !exHDCTList.isEmpty()) {
//            exHDCT = exHDCTList.get(0);
//
//            // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
//            hdct = exHDCT;
//            hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
//
//            // Kiểm tra nếu giá hoặc giảm giá của sản phẩm đã thay đổi
//            if ((ctsp.getDiscountPercentage() > 0 && hdct.getPromotion() == 0) ||
//                    (ctsp.getDiscountPercentage() == 0 && hdct.getPromotion() > 0) ||
//                    hdct.getPrice() != ctsp.getPrice()) {
//
//                // Tạo bản ghi mới nếu giá hoặc giảm giá thay đổi
//                BillDetail newBillDetail = new BillDetail();
//                newBillDetail.setBill(hoaDon);
//                newBillDetail.setProductDetail(ctsp);
//                newBillDetail.setQuantity(request.getQuantity());
//                newBillDetail.setPrice(ctsp.getPrice());
//                newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
//                newBillDetail.setPromotion(ctsp.getDiscountPercentage());
//
//                hoaDonChiTietRepository.save(newBillDetail);
//            } else {
//                // Cập nhật lại số lượng nếu không có sự thay đổi giá hoặc giảm giá
//                hoaDonChiTietRepository.save(hdct);
//            }
//        } else {
//            // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới hóa đơn chi tiết
//            hdct = billDetailConvert.convertRequestToEntity(request);
//            hdct.setPrice(ctsp.getPrice());
//            hdct.setQuantity(request.getQuantity());
//            hdct.setPromotion(ctsp.getDiscountPercentage());
//            hdct.setStatus(StatusBill.CHO_XAC_NHAN);
//
//            hoaDonChiTietRepository.save(hdct);
//        }
//
//        // Nếu sản phẩm đã tồn tại trong hóa đơn chi tiết, cập nhật số lượng
//        if (exHDCT != null) {
//            exHDCT.setQuantity(exHDCT.getQuantity() + request.getQuantity());
//            return hoaDonChiTietRepository.save(exHDCT);
//        } else {
//            // Cập nhật thông tin hóa đơn chi tiết mới
//            hdct.setPrice(ctsp.getDiscountPercentage() == 0 ? ctsp.getPrice() : ctsp.getDiscountPrice());
//            hdct.setQuantity(request.getQuantity());
//            hdct.setPromotion(ctsp.getDiscountPercentage());
//            hdct.setStatus(StatusBill.CHO_XAC_NHAN);
//            BillDetail saveHDCT = hoaDonChiTietRepository.save(hdct);
//
//            // Cập nhật tổng tiền hóa đơn
//            hoaDon = saveHDCT.getBill();
//            if (hoaDon.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
//                BigDecimal caculateTotalMoney = BigDecimal.ZERO;
//                for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hdct.getBill().getId())) {
//                    BigDecimal donGia = x.getPrice() != null ? x.getPrice() : BigDecimal.ZERO;
//                    BigDecimal soLuong = BigDecimal.valueOf(x.getQuantity());
//                    caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
//                }
//
//                // Tính toán tổng tiền sau khi trừ đi giảm giá
//                BigDecimal soTienDuocGiam = hoaDon.getDiscountAmount() != null ? hoaDon.getDiscountAmount() : BigDecimal.ZERO;
//                BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
//                hoaDon.setTotalMoney(tongTien);
//
//                // Lưu lịch sử hóa đơn nếu trạng thái hóa đơn đang xử lý
//                if (hoaDon.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN ||
//                        hoaDon.getInvoiceStatus() == StatusBill.VAN_CHUYEN ||
//                        hoaDon.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
//                    BillHistory lichSuHoaDon = new BillHistory();
//                    lichSuHoaDon.setBill(hoaDon);
//                    lichSuHoaDon.setActionDescription("Đã thêm " + request.getQuantity() +
//                            " sản phẩm \"" + ctsp.getProduct().getName() + " [" +
//                            (ctsp.getPrice()));
//                    lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
//                    lichSuHoaDonRepository.save(lichSuHoaDon);
//                }
//
//                // Lưu hóa đơn cập nhật vào cơ sở dữ liệu
//                hoaDonRepository.save(hoaDon);
//            }
//
//            return saveHDCT;
//        }
//    }



    @Override
    public BillDetail create1(BillDetailRequest request) {
        System.out.println("Dòng 61 :" + request.getIdBill());
        System.out.println("Hihi :" + request);

        // Chuyển đổi request thành entity BillDetail
        BillDetail hdct = billDetailConvert.convertRequestToEntity(request);
        System.out.println("Hoa don chi tiet:" + hdct);

        // Lấy chi tiết sản phẩm từ mã chi tiết
        ProductDetail ctsp = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
        System.out.println("Chi tiet san pham:" + ctsp);

        // Kiểm tra số lượng hợp lệ
        if (request.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > ctsp.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }

        // Cập nhật số lượng sản phẩm sau khi thêm vào giỏ
        ctsp.setQuantity(ctsp.getQuantity() - request.getQuantity());
        chiTietSanPhamRepository.save(ctsp);

        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng với mã chi tiết sản phẩm và hóa đơn
        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(request.getDetailCode(), request.getIdBill());

        if (exHDCTList != null) {
            // Sản phẩm đã có trong giỏ hàng, cộng số lượng lại
            BillDetail existingDetail = exHDCTList.get(0); // Lấy sản phẩm đầu tiên trong danh sách
            existingDetail.setQuantity(existingDetail.getQuantity() + request.getQuantity());
            return hoaDonChiTietRepository.save(existingDetail);
        } else {
            hdct.setQuantity(request.getQuantity());
            hdct.setPromotion(ctsp.getDiscountPercentage());
            hdct.setStatus(StatusBill.CHO_XAC_NHAN);

            BillDetail saveHDCT = hoaDonChiTietRepository.save(hdct);

            Bill hoaDon = saveHDCT.getBill();

            if (hoaDon.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
                BigDecimal caculateTotalMoney = BigDecimal.ZERO;
                for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hdct.getBill().getId())) {
                    BigDecimal donGia = x.getPrice() != null ? x.getPrice() : BigDecimal.ZERO;
                    BigDecimal soLuong = BigDecimal.valueOf(x.getQuantity());
                    caculateTotalMoney = caculateTotalMoney.add(donGia.multiply(soLuong));
                }

                BigDecimal soTienDuocGiam = hoaDon.getDiscountAmount() != null ? hoaDon.getDiscountAmount() : BigDecimal.ZERO;
                BigDecimal tongTien = caculateTotalMoney.subtract(soTienDuocGiam);
                hoaDon.setTotalMoney(tongTien);
                if (hoaDon.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hoaDon.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hoaDon.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
                    BillHistory lichSuHoaDon = new BillHistory();
                    lichSuHoaDon.setBill(hoaDon);
                    lichSuHoaDon.setActionDescription("Đã thêm " + request.getQuantity() + " sản phẩm \"" + ctsp.getProduct().getName() + "]\"");
                    lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
                    lichSuHoaDonRepository.save(lichSuHoaDon);
                }

                hoaDonRepository.save(hoaDon);
            }

            return saveHDCT;
        }
    }


    @Override
    public BillDetail update(Integer id, BillDetailRequest request) {
        BillDetail hdct = hoaDonChiTietRepository.findById(id).get();
        return hoaDonChiTietRepository.save(billDetailConvert.convertRequestToEntity(hdct, request));
    }

    @Override
    public BillDetail delete(Integer id) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        System.out.println("hdct : " + hoaDonChiTiet);
        ProductDetail chiTietSanPham = hoaDonChiTiet.getProductDetail();
        System.out.println("ctsp" + chiTietSanPham);
        chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + hoaDonChiTiet.getQuantity());
        hoaDonChiTietRepository.delete(hoaDonChiTiet);

        Bill hd = hoaDonChiTiet.getBill();
        if (hd.getInvoiceStatus() != StatusBill.TAO_HOA_DON) {
            // Xử lý tính tổng tiền
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            BigDecimal soTienDuocGiam = hd.getDiscountAmount() != null ? hd.getDiscountAmount() : BigDecimal.ZERO;
            hd.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(soTienDuocGiam));

//            if (hd.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hd.getInvoiceStatus() == StatusBill.VAN_CHUYEN || hd.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
            BillHistory lichSuHoaDon = new BillHistory();
            lichSuHoaDon.setBill(hd);
            lichSuHoaDon.setActionDescription("Đã xóa " + hoaDonChiTiet.getQuantity() + " sản phẩm \"" + chiTietSanPham.getProduct().getName() + " [" + hoaDonChiTiet.getPrice() + "]\"");
            lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon);
//            }

            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }


    @Override
    public BillDetail updateSoLuong(Integer id, Integer newQuantity, BigDecimal donGia) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        ProductDetail chiTietSanPham = hoaDonChiTiet.getProductDetail();
        if (newQuantity > (chiTietSanPham.getQuantity())) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (newQuantity <= 0) {
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        chiTietSanPham.setQuantity(chiTietSanPham.getQuantity() + hoaDonChiTiet.getQuantity() - newQuantity);
        hoaDonChiTiet.setQuantity(newQuantity);
        if (hoaDonChiTiet.getPrice().compareTo(donGia) < 0) {
            hoaDonChiTiet.setPrice(donGia);
        }
        hoaDonChiTietRepository.save(hoaDonChiTiet);
//        chiTietSanPhamRepository.save(chiTietSanPham);
        Bill hd = hoaDonChiTiet.getBill();
        if (hd.getInvoiceStatus() == StatusBill.TAO_HOA_DON) {
            // Hàm xử lý update lại tiền
            Double caculateTotalMoney = 0.0;
            for (BillDetail x : hoaDonChiTietRepository.findByHoaDonId(hd.getId())) {
                caculateTotalMoney += x.getQuantity() * x.getPrice().doubleValue();
            }
            BigDecimal soTienDuocGiam = hd.getDiscountAmount() != null ? hd.getDiscountAmount() : BigDecimal.ZERO;
            hd.setTotalMoney(BigDecimal.valueOf(caculateTotalMoney).subtract(soTienDuocGiam));

//            if (hd.getInvoiceStatus() == StatusBill.CHO_XAC_NHAN || hd.getInvoiceStatus() == StatusBill.XAC_NHAN || hd.getInvoiceStatus() == StatusBill.CHO_VAN_CHUYEN) {
            BillHistory lichSuHoaDon = new BillHistory();
            lichSuHoaDon.setBill(hd);
            lichSuHoaDon.setActionDescription("Đã cập nhật" + hoaDonChiTiet.getQuantity() + " sản phẩm \"" + chiTietSanPham.getProduct().getName() + " [" + hoaDonChiTiet.getPrice() + "]\"");
            lichSuHoaDon.setStatus(StatusBill.XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon);
//            }
            hoaDonRepository.save(hd);
        }
        return hoaDonChiTiet;
    }


    @Override
    public BillDetail createBillDetail(BillDetailRequest request, Integer idNhanVien) {
        ProductDetail productDetail = chiTietSanPhamRepository.findByDetailCode(request.getDetailCode());
        Employee employee = employeeRepository.findById(idNhanVien).get();
        // Cập nhật tổng tiền hóa đơn
        Bill hoaDon = hoaDonRepository.findById(request.getIdBill())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + request.getIdBill()));
        //Voucher moi phu hop

        System.out.println("Dot giam gia:" + productDetail);
        System.out.println("Dòng 61 :" + request.getIdBill());
        System.out.println("Hihi :" + request);

        if (productDetail == null) {
            throw new RestApiException("Không tìm thấy sản phẩm với mã chi tiết!");
        }

        if (request.getQuantity() < 1) {
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > productDetail.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }


        // Kiểm tra sản phẩm trong giỏ hàng
        List<BillDetail> exHDCTList = hoaDonChiTietRepository.findChiTietSanPhamMaAndHoaDonID(request.getDetailCode(), request.getIdBill());
        BillDetail hdct = null; // Khởi tạo hdct với giá trị mặc định là null

        if (exHDCTList != null && !exHDCTList.isEmpty()) {
            // Nếu tồn tại bản ghi trong giỏ hàng
            if (exHDCTList.size() == 1) {
                // Nếu chỉ có một bản ghi, lấy bản ghi đó
                hdct = exHDCTList.get(0);
            } else {
                // Nếu có nhiều hơn một bản ghi, lấy bản ghi mới nhất (ngày tạo sớm nhất)
                hdct = exHDCTList.stream()
                        .max(Comparator.comparing(BillDetail::getCreatedAt))
                        .orElse(exHDCTList.get(0));
            }

            // Kiểm tra giá của bản ghi được chọn
            if (hdct.getPrice().equals(productDetail.getPrice())) {
                // Nếu giá trùng khớp, cộng dồn số lượng
                hdct.setQuantity(hdct.getQuantity() + request.getQuantity());
                hoaDonChiTietRepository.save(hdct);
            } else {
                // Nếu giá khác, tạo một bản ghi mới
                BillDetail newBillDetail = new BillDetail();
                newBillDetail.setBill(hoaDon);
                newBillDetail.setProductDetail(productDetail);
                newBillDetail.setQuantity(request.getQuantity());
                newBillDetail.setPrice(productDetail.getPrice());
                newBillDetail.setStatus(StatusBill.CHO_XAC_NHAN);
                newBillDetail.setPromotion(productDetail.getDiscountPercentage());

                hoaDonChiTietRepository.save(newBillDetail);
            }
        } else {
            // Nếu không có bản ghi nào trong giỏ hàng
            hdct = billDetailConvert.convertRequestToEntity(request);
            hdct.setPrice(productDetail.getPrice());
            hdct.setQuantity(request.getQuantity());
            hdct.setPromotion(productDetail.getDiscountPercentage());
            hdct.setStatus(StatusBill.CHO_XAC_NHAN);

            hoaDonChiTietRepository.save(hdct);
        }

        if (hoaDon.getInvoiceType() == TypeBill.TAI_QUAY) {

            List<BillDetail> billDetails = hoaDonChiTietRepository.findAllByIdBillCreate(hoaDon.getId()); //ĐƠN MƠID

            BigDecimal totalMoney = BigDecimal.ZERO;

            for (BillDetail b : billDetails) {
                BigDecimal price = b.getPromotion() == 0
                        ? b.getPrice()
                        : b.getPrice().multiply(BigDecimal.valueOf(100 - b.getPromotion()).divide(BigDecimal.valueOf(100)));
                int quantity = b.getQuantity();

                // Tổng tiền từng sản phẩm = giá cuối * số lượng
                totalMoney = totalMoney.add(price.multiply(BigDecimal.valueOf(quantity)));
            }

            hoaDon.setTotalMoney(totalMoney);
            hoaDon.setShippingFee(BigDecimal.ZERO);
            hoaDonRepository.save(hoaDon);
        } else {

            BigDecimal tongTienThanhToanCu = hoaDon.getTotalMoney()
                    .add(hoaDon.getShippingFee())
                    .subtract(hoaDon.getDiscountAmount());

            List<BillDetail> billDetails = hoaDonChiTietRepository.findAllByIdBillCreate(hoaDon.getId()); //ĐƠN MƠID

            BigDecimal totalMoney = BigDecimal.ZERO; //DDay la tien moi

            for (BillDetail b : billDetails) {
                BigDecimal price = b.getPromotion() == 0
                        ? b.getPrice()
                        : b.getPrice().multiply(BigDecimal.valueOf(100 - b.getPromotion()).divide(BigDecimal.valueOf(100)));
                int quantity = b.getQuantity(); // Số lượng

                // Tổng tiền từng sản phẩm = giá cuối * số lượng
                totalMoney = totalMoney.add(price.multiply(BigDecimal.valueOf(quantity)));
            }

            Voucher voucher = cartService.autoSelectVoucher(totalMoney, hoaDon.getCustomer().getId()); // Voucher mới phù hợp với tổng tiền mới

            // Kiểm tra nếu voucher không phải là null
            if (voucher != null && voucher.getId() != null) {
                hoaDon.setVoucher(voucher);
                hoaDon.setDiscountAmount(
                        voucher.getDiscountMethod() == MethodVoucher.PHAN_TRAM
                                ? totalMoney.multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100)))
                                : totalMoney.subtract(voucher.getDiscountValue())
                );
            } else {
                // Xử lý khi không tìm thấy voucher phù hợp
                hoaDon.setVoucher(null); // Nếu không có voucher, có thể gán là null
                hoaDon.setDiscountAmount(BigDecimal.ZERO); // Hoặc không áp dụng chiết khấu
            }

            // Cập nhật thông tin tổng tiền và phí vận chuyển
            hoaDon.setTotalMoney(totalMoney);
            if (totalMoney.compareTo(BigDecimal.valueOf(2000000)) > 0) {
                hoaDon.setShippingFee(BigDecimal.ZERO);
            }

            hoaDonRepository.save(hoaDon);

            Bill hoaDon1 = hoaDonRepository.findById(request.getIdBill())
                    .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + request.getIdBill()));

            BigDecimal tongTienThanhToanMoi = hoaDon1.getTotalMoney()
                    .add(hoaDon1.getShippingFee())
                    .subtract(hoaDon1.getDiscountAmount());

            BigDecimal tongTienMoi = hoaDon1.getTotalMoney()
                    .add(hoaDon1.getShippingFee())
                    .subtract(hoaDon1.getDiscountAmount());

            if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.TRA_SAU) {

                Payment payment = paymentRepository.findByIdBill(request.getIdBill());
                payment.setTotalMoney(tongTienThanhToanMoi);
                paymentRepository.save(payment);

            } else if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.DA_THANH_TOAN) {
                BigDecimal chenhLech = tongTienThanhToanMoi.subtract(tongTienThanhToanCu);

                Payment payment = new Payment();
                payment.setBill(hoaDon);
                payment.setEmployee(employee);
                payment.setTotalMoney(chenhLech.abs());
                // Xử lý thanh toán
                payment.setMethod(StatusMethod.TIEN_MAT);
                payment.setStatus(StatusPayMents.TRA_SAU);

                paymentRepository.save(payment);
            }

            BillHistory lichSuHoaDon = new BillHistory();
            lichSuHoaDon.setEmployee(employee);
            lichSuHoaDon.setBill(hoaDon);
            lichSuHoaDon.setActionDescription("Nhân viên" + employee.getName() + "Đã thêm " + request.getQuantity() + " sản phẩm \"" + productDetail.getProduct().getName() + "\"");
            lichSuHoaDon.setStatus(StatusBill.THAY_DOI);
            lichSuHoaDonRepository.save(lichSuHoaDon);

            BillHistory lichSuHoaDon1 = new BillHistory();
            lichSuHoaDon1.setEmployee(employee);
            lichSuHoaDon1.setBill(hoaDon);
            lichSuHoaDon1.setActionDescription("Chờ xác nhận");
            lichSuHoaDon1.setStatus(StatusBill.CHO_XAC_NHAN);
            lichSuHoaDonRepository.save(lichSuHoaDon1);
        }
        return hdct;
    }

    @Override
    public BillDetail deleteBillDetail(Integer idHDCT, Integer idNhanVien) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(idHDCT).get();
        ProductDetail productDetail = chiTietSanPhamRepository.findByDetailCode(hoaDonChiTiet.getProductDetail().getDetailCode());
        Employee employee = employeeRepository.findById(idNhanVien).get();


//        productDetail.setQuantity(productDetail.getQuantity() + hoaDonChiTiet.getQuantity());
//        chiTietSanPhamRepository.save(productDetail);

        hoaDonChiTietRepository.delete(hoaDonChiTiet);

        // Cập nhật tổng tiền hóa đơn
        Bill hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getBill().getId())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + hoaDonChiTiet.getBill().getId()));

        BigDecimal tongTienThanhToanCu = hoaDon.getTotalMoney()
                .add(hoaDon.getShippingFee())
                .subtract(hoaDon.getDiscountAmount());

        BigDecimal tongTienCu = hoaDon.getTotalMoney();

        List<BillDetail> billDetails = hoaDonChiTietRepository.findAllByIdBillCreate(hoaDon.getId());

        BigDecimal totalMoney = BigDecimal.ZERO; //DDay la tien moi

        for (BillDetail b : billDetails) {
            BigDecimal price = b.getPromotion() == 0
                    ? b.getPrice()
                    : b.getPrice().multiply(BigDecimal.valueOf(100 - b.getPromotion()).divide(BigDecimal.valueOf(100)));
            int quantity = b.getQuantity(); // Số lượng

            // Tổng tiền từng sản phẩm = giá cuối * số lượng
            totalMoney = totalMoney.add(price.multiply(BigDecimal.valueOf(quantity)));
        }

        Voucher voucher = cartService.autoSelectVoucher(totalMoney, hoaDon.getCustomer().getId());
        if (voucher == null) {
            // Xử lý khi không có voucher phù hợp
            hoaDon.setDiscountAmount(BigDecimal.ZERO);  // Ví dụ, không áp dụng chiết khấu
        } else {
            if (voucher.getId() != null) {
                hoaDon.setVoucher(voucher);
                hoaDon.setDiscountAmount(
                        voucher.getDiscountMethod() == MethodVoucher.PHAN_TRAM
                                ? totalMoney.multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100)))
                                : totalMoney.subtract(voucher.getDiscountValue())
                );
            }
        }

        hoaDon.setTotalMoney(totalMoney);
        if (totalMoney.compareTo(BigDecimal.valueOf(2000000)) > 0) {
            hoaDon.setShippingFee(BigDecimal.ZERO);
        }

        hoaDonRepository.save(hoaDon);

        Bill hoaDon1 = hoaDonRepository.findById(hoaDonChiTiet.getBill().getId())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + hoaDonChiTiet.getBill().getId()));

        BigDecimal tongTienThanhToanMoi = hoaDon1.getTotalMoney()
                .add(hoaDon1.getShippingFee())
                .subtract(hoaDon1.getDiscountAmount());

        if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.TRA_SAU) {

            Payment payment = paymentRepository.findByIdBill(hoaDonChiTiet.getBill().getId());
            payment.setTotalMoney(tongTienThanhToanMoi);
            paymentRepository.save(payment);

        } else if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.DA_THANH_TOAN) {
            BigDecimal chenhLech = tongTienThanhToanMoi.subtract(tongTienThanhToanCu);

            Payment payment = new Payment();
            payment.setBill(hoaDon);
            payment.setEmployee(employee);
            payment.setTotalMoney(chenhLech.abs());
            // Xử lý thanh toán
            payment.setMethod(StatusMethod.CHUYEN_KHOAN);
            payment.setStatus(StatusPayMents.HOAN_TIEN);

            paymentRepository.save(payment);
        }

        BillHistory lichSuHoaDon = new BillHistory();
        lichSuHoaDon.setEmployee(employee);
        lichSuHoaDon.setBill(hoaDon);
        lichSuHoaDon.setActionDescription("Nhân viên" + employee.getName() + "Đã xóa " + " sản phẩm \"" + productDetail.getProduct().getName() + "\"");
        lichSuHoaDon.setStatus(StatusBill.THAY_DOI);
        lichSuHoaDonRepository.save(lichSuHoaDon);

        BillHistory lichSuHoaDon1 = new BillHistory();
        lichSuHoaDon1.setEmployee(employee);
        lichSuHoaDon1.setBill(hoaDon);
        lichSuHoaDon1.setActionDescription("Chờ xác nhận");
        lichSuHoaDon1.setStatus(StatusBill.CHO_XAC_NHAN);
        lichSuHoaDonRepository.save(lichSuHoaDon1);

        return hoaDonChiTiet;
    }

    @Override
    public BillDetail updateSoLuongBillDetail(Integer id, Integer newQuantity, Integer idNhanVien) {
        BillDetail hoaDonChiTiet = hoaDonChiTietRepository.findById(id).get();
        ProductDetail productDetail = chiTietSanPhamRepository.findByDetailCode(hoaDonChiTiet.getProductDetail().getDetailCode());
        Employee employee = employeeRepository.findById(idNhanVien).get();

//        Integer soLuongCu = hoaDonChiTiet.getQuantity();
//        Integer chenhLechSoLuong = newQuantity - soLuongCu;
//
//        if (newQuantity > soLuongCu) {
//            // Nếu số lượng mới lớn hơn số lượng cũ, giảm số lượng tồn kho
//            productDetail.setQuantity(productDetail.getQuantity() - chenhLechSoLuong);
//            chiTietSanPhamRepository.save(productDetail);
//        } else {
//            // Nếu số lượng mới nhỏ hơn số lượng cũ, tăng số lượng tồn kho
//            productDetail.setQuantity(productDetail.getQuantity() + Math.abs(chenhLechSoLuong));
//            chiTietSanPhamRepository.save(productDetail);
//        }

        //Update lại số lượng theo số lượng mới
        hoaDonChiTiet.setQuantity(newQuantity);
        hoaDonChiTietRepository.save(hoaDonChiTiet);

        // Cập nhật tổng tiền hóa đơn
        Bill hoaDon = hoaDonRepository.findById(hoaDonChiTiet.getBill().getId())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + hoaDonChiTiet.getBill().getId()));

        BigDecimal tongTienThanhToanCu = hoaDon.getTotalMoney()
                .add(hoaDon.getShippingFee())
                .subtract(hoaDon.getDiscountAmount());


        List<BillDetail> billDetails = hoaDonChiTietRepository.findAllByIdBillCreate(hoaDon.getId());

        BigDecimal totalMoney = BigDecimal.ZERO; //DDay la tien moi

        for (BillDetail b : billDetails) {
            BigDecimal price = b.getPromotion() == 0
                    ? b.getPrice()
                    : b.getPrice().multiply(BigDecimal.valueOf(100 - b.getPromotion()).divide(BigDecimal.valueOf(100)));
            int quantity = b.getQuantity(); // Số lượng

            // Tổng tiền từng sản phẩm = giá cuối * số lượng
            totalMoney = totalMoney.add(price.multiply(BigDecimal.valueOf(quantity)));
        }


        Voucher voucher = cartService.autoSelectVoucher(totalMoney, hoaDon.getCustomer().getId());//Voucher moi phu hop voi tong tien moi

        if (voucher.getId() != null) {
            hoaDon.setVoucher(voucher);
            hoaDon.setDiscountAmount(
                    voucher.getDiscountMethod() == MethodVoucher.PHAN_TRAM
                            ? totalMoney.multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100)))
                            : totalMoney.subtract(voucher.getDiscountValue())
            );
        }

        hoaDon.setTotalMoney(totalMoney);
        if (totalMoney.compareTo(BigDecimal.valueOf(2000000)) > 0) {
            hoaDon.setShippingFee(BigDecimal.ZERO);
        }

        hoaDonRepository.save(hoaDon);

        Bill hoaDon1 = hoaDonRepository.findById(hoaDonChiTiet.getBill().getId())
                .orElseThrow(() -> new RestApiException("Không tìm thấy hóa đơn với ID: " + hoaDonChiTiet.getBill().getId()));

        BigDecimal tongTienThanhToanMoi = hoaDon1.getTotalMoney()
                .add(hoaDon1.getShippingFee())
                .subtract(hoaDon1.getDiscountAmount());

        if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.TRA_SAU) {

            Payment payment = paymentRepository.findByIdBill(hoaDonChiTiet.getBill().getId());
            payment.setTotalMoney(tongTienThanhToanMoi);
            paymentRepository.save(payment);

        } else if (hoaDon.getInvoiceType() == TypeBill.TRUC_TUYEN && hoaDon.getPaymentStatus() == StatusPayMents.DA_THANH_TOAN) {
            BigDecimal chenhLech = tongTienThanhToanMoi.subtract(tongTienThanhToanCu);

            if (chenhLech.compareTo(BigDecimal.ZERO) > 0) {
                Payment payment = new Payment();
                payment.setBill(hoaDon);
                payment.setEmployee(employee);
                payment.setTotalMoney(chenhLech.abs());
                // Xử lý thanh toán
                payment.setMethod(StatusMethod.TIEN_MAT);
                payment.setStatus(StatusPayMents.TRA_SAU);

                paymentRepository.save(payment);
            } else if (chenhLech.compareTo(BigDecimal.ZERO) < 0) {
                Payment payment = new Payment();
                payment.setBill(hoaDon);
                payment.setEmployee(employee);
                payment.setTotalMoney(chenhLech.abs());
                // Xử lý thanh toán
                payment.setMethod(StatusMethod.CHUYEN_KHOAN);
                payment.setStatus(StatusPayMents.HOAN_TIEN);
                paymentRepository.save(payment);
            }
        }


        BillHistory lichSuHoaDon = new BillHistory();
        lichSuHoaDon.setEmployee(employee);
        lichSuHoaDon.setBill(hoaDon);
        lichSuHoaDon.setActionDescription("Nhân viên" + employee.getName() + "Đã sửa lại số lượng của " + " sản phẩm \"" + productDetail.getProduct().getName() + "\"");
        lichSuHoaDon.setStatus(StatusBill.THAY_DOI);
        lichSuHoaDonRepository.save(lichSuHoaDon);

        BillHistory lichSuHoaDon1 = new BillHistory();
        lichSuHoaDon1.setEmployee(employee);
        lichSuHoaDon1.setBill(hoaDon);
        lichSuHoaDon1.setActionDescription("Chờ xác nhận");
        lichSuHoaDon1.setStatus(StatusBill.CHO_XAC_NHAN);
        lichSuHoaDonRepository.save(lichSuHoaDon1);

        return hoaDonChiTiet;

    }

}
