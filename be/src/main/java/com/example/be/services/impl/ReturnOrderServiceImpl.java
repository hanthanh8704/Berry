package com.example.be.services.impl;


import com.example.be.configs.FormatCurrency;
import com.example.be.dto.admin.request.billgiveback.ChangAllStatusBillGiveBackIdsRequest;
import com.example.be.dto.admin.request.billgiveback.UpdateBillDetailGiveBack;
import com.example.be.dto.admin.request.billgiveback.UpdateBillGiveBack;
import com.example.be.dto.admin.response.bill.BillGiveBack;
import com.example.be.dto.admin.response.bill.BillGiveBackInformation;
import com.example.be.dto.admin.response.bill.InvoiceResponse;
import com.example.be.dto.admin.response.voucher.VoucherCustomerRepository;
import com.example.be.entities.*;
import com.example.be.repositories.admin.*;
import com.example.be.services.ReturnOrderService;
import com.example.be.utils.MailUtils;
import com.example.be.utils.constant.MethodVoucher;
import com.example.be.utils.constant.StatusBill;

import com.example.be.utils.constant.StatusReturnOrder;
import com.example.be.utils.exception.RestApiException;
import com.example.be.utils.exportPdf.ExportFilePdfFormHtml;
import com.example.be.utils.qrCode.QRCodeGenerator;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.io.FileOutputStream;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ReturnOrderServiceImpl implements ReturnOrderService {
    @Autowired
    BillRepository billRepository;
    @Autowired
    BillDetailRepository billDetailRepository;
    @Autowired
    ProductDetailRepository productDetailRepository;
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    VoucherRepository voucherRepository;
    @Autowired
    VoucherCustomerRepository voucherCustomerRepository;
    @Autowired
    BillHistoryRepository billHistoryRepository;
    @Autowired
    ReturnOrderDetailRepository returnOrderDetailRepository;
    @Autowired
    ReturnOrderRepository returnOrderRepository;

    @Autowired
    private SpringTemplateEngine springTemplateEngine;


    @Autowired
    private ExportFilePdfFormHtml exportFilePdfFormHtml;
    @Autowired
    MailUtils mailUtils;

    @Override
    public BillGiveBackInformation getBillGiveBackInformation(String codeBill) {
        Bill bill = billRepository.findByCode(codeBill);
        if (bill == null) {
            throw new RestApiException("Không tìm thấy mã hóa đơn " + codeBill);
        }

        if (bill.getInvoiceStatus() == StatusBill.DA_HUY) {
            throw new RestApiException("Hóa đơn " + codeBill + " đã bị hủy.");

        }

        if (bill.getInvoiceStatus().equals(StatusBill.THANH_CONG)) {
            LocalDate receivedDate = bill.getReceivedDate().toLocalDateTime().toLocalDate();
            LocalDate endReturnDate = receivedDate.plusDays(2);  // Hết hạn vào cuối ngày thứ 2 sau ngày nhận hàng
            LocalDate currentDate = LocalDate.now();

            // Chỉ cho phép trả hàng từ ngày nhận đến ngày thứ 2 sau đó
            if (currentDate.isBefore(receivedDate) || currentDate.isAfter(endReturnDate)) {
                throw new RestApiException("Đơn hàng đã hết hạn hoàn đổi.");
            }
        }

        boolean isReturned = billHistoryRepository.existsByBillAndStatus(bill, StatusBill.TRA_HANG);
        if (isReturned) {
            throw new RestApiException("Đơn hàng " + codeBill + " đã từng trả hàng. Vui lòng chọn đơn hàng mới.");
        }

        if (bill.getInvoiceStatus() != StatusBill.THANH_CONG && bill.getInvoiceStatus() != StatusBill.TRA_HANG) {
            throw new RestApiException("Hóa đơn " + codeBill + " này chưa được thanh toán");
        }

    // Kiểm tra nếu hóa đơn đã được trả hàng

        return billRepository.getBillGiveBackInformation(codeBill);
    }

    @Override
    public List<BillGiveBack> getBillGiveBack(Integer idBill) {
        return billRepository.getBillGiveBack(idBill);
    }

    @Override
    public String createAllFilePdf(ChangAllStatusBillGiveBackIdsRequest request) {
        StringBuilder stringBuilder = new StringBuilder();
        request.getIdReturnOrderDetails().parallelStream().forEach(item -> {
            Optional<Bill> optional = billRepository.findById(item);
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
    public ReturnOrder findByIdBill(Integer idBill) {
        ReturnOrder returnOrder = returnOrderRepository.findByIdBill(idBill);
        return returnOrder;
    }

    @Override
    public Bill updateBillGiveBack(Integer idEmployee, UpdateBillGiveBack updateBillGiveBack, List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks) {
        Employee employee = employeeRepository.findById(idEmployee)
                .orElseThrow(() -> new RuntimeException("Employee not found."));
        Account account = accountRepository.findById(employee.getAccount().getId())
                .orElseThrow(() -> new RuntimeException("Account not found."));
        Bill bill = billRepository.findById(updateBillGiveBack.getIdBill())
                .orElseThrow(() -> new RuntimeException("Bill not found."));

        BigDecimal totalBill = bill.getTotalMoney();
        BigDecimal totalBillGive = updateBillGiveBack.getTotalBillGiveBack();

        if (totalBill.compareTo(totalBillGive) < 0) {
            throw new RuntimeException("Tổng số tiền hoàn lại vượt quá tổng số tiền hóa đơn.");
        }

        // Kiểm tra voucher
        Voucher voucher = null;
        if (updateBillGiveBack.getIdVoucher() != null) {
            voucher = voucherRepository.findById(updateBillGiveBack.getIdVoucher())
                    .orElse(null); // Trường hợp voucher không tồn tại
        }


        bill.setVoucher(voucher);
        bill.setInvoiceStatus(StatusBill.TRA_HANG);
        bill.setTotalMoney(totalBill.subtract(totalBillGive));
        bill.setShippingFee(totalBill.equals(totalBillGive) ? BigDecimal.ZERO : bill.getShippingFee());
        if (voucher != null) {
            bill.setDiscountAmount(
                    voucher.getDiscountMethod() == MethodVoucher.PHAN_TRAM
                            ? bill.getTotalMoney().multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100))) // Tính chiết khấu phần trăm
                            : voucher.getDiscountValue() // Chiết khấu cố định
            );
        } else {
            bill.setDiscountAmount(BigDecimal.ZERO); // Không có voucher thì không có chiết khấu
        }

        billRepository.save(bill);
        //Update lại số lượng voucher
        if (voucher != null) {
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }
        BillHistory billHistory = BillHistory.builder()
                .bill(bill)
                .actionDescription(updateBillGiveBack.getNote())
                .employee(employee)
                .status(StatusBill.TRA_HANG)
                .build();
        billHistoryRepository.save(billHistory);

        List<BillDetail> listUpdateBillDetail = updateBillDetailGiveBacks.stream().map(data -> {
            BillDetail billDetail = billDetailRepository.findById(data.getIdBillDetail())
                    .orElseThrow(() -> new RuntimeException("Bill detail not found."));

            int updatedQuantity = billDetail.getQuantity() - data.getQuantity();

            if (updatedQuantity < 0) {
                throw new RuntimeException("Số lượng trả lại vượt quá số lượng đặt hàng.");
            }

            billDetail.setStatus(StatusBill.TRA_HANG);
            billDetail.setQuantity(updatedQuantity);
            return billDetail;
        }).collect(Collectors.toList());

        // Kiểm tra tồn tại của ReturnOrder
        ReturnOrder returnOrder = returnOrderRepository.findByIdBill(bill.getId());

        if (returnOrder == null) {
            ReturnOrder returnOrderNew = new ReturnOrder();
            returnOrderNew.setBill(bill);
            returnOrderNew.setEmployee(employee);
            returnOrderNew.setCustomer(bill.getCustomer());
            returnOrderNew.setReason(updateBillGiveBack.getNote());
            returnOrderNew.setStatus(StatusBill.TRA_HANG);
            returnOrderNew.setTotalReturnAmount(updateBillGiveBack.getTotalBillGiveBackCustomer());
            returnOrderNew.setRequestDate(Timestamp.valueOf(LocalDateTime.now()));
            returnOrderNew.setApprovalDate(Timestamp.valueOf(LocalDateTime.now()));
            returnOrderNew.setCreatedBy(employee.getCode());
            returnOrderNew.setUpdatedBy(employee.getCode());
            returnOrder = returnOrderRepository.save(returnOrderNew);
        } else {
            // Cập nhật thông tin của ReturnOrder hiện tại
            returnOrder.setReason(updateBillGiveBack.getNote());
            returnOrder.setTotalReturnAmount(returnOrder.getTotalReturnAmount().add(totalBillGive));
            returnOrder.setApprovalDate(Timestamp.valueOf(LocalDateTime.now()));
            returnOrder.setUpdatedBy(employee.getCode());
            returnOrderRepository.save(returnOrder);
        }

        // Xử lý chi tiết trả hàng với hàm phụ trợ
        List<ReturnOrderDetail> returnOrderDetails = createReturnOrderDetails(updateBillDetailGiveBacks, returnOrder);
        billDetailRepository.saveAll(listUpdateBillDetail);
        returnOrderDetailRepository.saveAll(returnOrderDetails);

        for (ReturnOrderDetail r : returnOrderDetails) {
            // Tìm bản ghi ProductDetail từ database
            ProductDetail productDetail = productDetailRepository.findById(r.getProductDetail().getId()).orElse(null);

            // Nếu không tìm thấy ProductDetail, bỏ qua và tiếp tục vòng lặp
            if (productDetail == null) {
                System.out.println("Không tìm thấy sản phẩm với ID: " + r.getProductDetail().getId());
                continue;
            }

            // Dựa vào trạng thái, thực hiện xử lý
            if (r.getStatus().equals(StatusReturnOrder.LOI)) {
                // Nếu là "Lỗi", cộng số lượng vào `QuantityError`
                productDetail.setQuantityError(productDetail.getQuantityError() + r.getQuantity());
            } else if (r.getStatus().equals(StatusReturnOrder.NHAM)) {
                // Nếu là "Nhầm", cộng số lượng vào `Quantity`
                productDetail.setQuantity(productDetail.getQuantity() + r.getQuantity());
            }

            // Lưu bản ghi ProductDetail đã cập nhật vào database
            productDetailRepository.save(productDetail);
        }
        // Tạo nội dung email
        String customerName = bill.getRecipientName();
        String billCode = bill.getCode();
        String orderDate = returnOrder.getRequestDate().toLocalDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")); // Định dạng ngày


        StringBuilder orderDetails = new StringBuilder();
        int stt = 1;
        for (UpdateBillDetailGiveBack detail : updateBillDetailGiveBacks) {
            BillDetail billDetail = billDetailRepository.findById(detail.getIdBillDetail())
                    .orElseThrow(() -> new RuntimeException("Bill detail not found."));

            // Kiểm tra số lượng
            if (detail.getQuantity() <= 0) {
                throw new RuntimeException("Số lượng trả hàng không hợp lệ.");
            }

            orderDetails.append(String.format(
                    """
                            <tr>
                                <td>%d</td>
                                <td>%s</td>                           
                                <td>%d</td>
                                <td>%s VND</td>
                                <td>%s VND</td>
                            </tr>
                            """,
                    stt++,
                    billDetail.getProductDetail().getProduct().getName() + " [" +
                            billDetail.getProductDetail().getColor().getName() + "-" +
                            billDetail.getProductDetail().getSize().getName() + "]",
                    detail.getQuantity(),
                    FormatCurrency.format(billDetail.getPrice()),
                    FormatCurrency.format(billDetail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
            ));

        }


        // Tạo nội dung email
        String emailContent = String.format("""
                        <!DOCTYPE html>
                        <html lang='vi'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <title>Email Trả Hàng</title>
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
                                .return-info, .return-details {
                                    width: 100%%;
                                    margin-bottom: 20px;
                                    border-collapse: collapse;
                                }
                                .return-info th, .return-details th,
                                .return-info td, .return-details td {
                                    padding: 10px;
                                    text-align: left;
                                    border: 1px solid #ddd;
                                    font-size: 14px;
                                }
                                .return-info th, .return-details th {
                                    background-color: #f7f7f7;
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
                                    <h1>Cảm ơn bạn đã liên hệ với Berry Store!</h1>
                                      <img src='cid:qrCodeImage' alt='QR Code' class='qr-code' />     
                                </div>
                                <div class='email-content'>
                                    <p>Kính gửi: <strong>%s</strong>,</p>
                                    <p>Cảm ơn bạn đã thông báo về việc trả hàng. Dưới đây là thông tin chi tiết về yêu cầu trả hàng của bạn:</p>

                                    <h3>Thông tin trả hàng</h3>
                                    <table class='return-info'>
                                        <tr>
                                            <th>Mã hóa đơn</th>
                                            <td>%s</td>
                                        </tr>
                                        <tr>
                                            <th>Ngày yêu cầu trả hàng</th>
                                            <td>%s</td>
                                        </tr>
                                        <tr>
                                            <th>Tổng số tiền hoàn trả</th>
                                            <td><span class='highlight'>%s VND</span></td>
                                        </tr>
                                    </table>

                                    <h3>Chi tiết sản phẩm trả hàng</h3>
                                    <table class='return-details'>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng trả</th>
                                            <th>Giá bán</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                        %s
                                    </table>

                                    <p>Chúng tôi sẽ xem xét yêu cầu trả hàng của bạn và sẽ liên hệ lại sớm nhất có thể.</p>
                                   <p>Thông tin đơn hàng bạn sẽ xem <a href='http://localhost:3000/tracking/%s' class='track-link'>Tại đây</a>.</p>
                                    <hr>
                                    <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                                    <p>Hotline: <strong>0393977745</strong></p>
                                    <p>Trường cao đẳng FPT Polytechnic, P.Trịnh Văn Bô, P.Phương Canh, Q.Nam Từ Liêm, TP.Hà Nội</p>
                                    <p>Trân trọng,</p>
                                    <p><strong>Berry Store</strong></p>
                                </div>
                                <div class='footer'>
                                    <p>Email này là tự động. Vui lòng không trả lời email này.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                customerName, billCode, orderDate, FormatCurrency.format(updateBillGiveBack.getTotalBillGiveBackCustomer()), orderDetails.toString(), billCode);

        // Gửi email với mã QR
        try {
            String qrCodeText = "http://localhost:3000/tracking/" + bill.getCode();
            byte[] qrCodeImage = QRCodeGenerator.getQRCodeImage(qrCodeText, 200, 200);
            File qrCodeFile = File.createTempFile("qrCode", ".png");
            try (FileOutputStream fos = new FileOutputStream(qrCodeFile)) {
                fos.write(qrCodeImage);
            }

            mailUtils.sendEmailClient(
                    bill.getRecipientEmail(),
                    "Thông báo xử lý yêu cầu trả hàng",
                    emailContent, qrCodeFile.getPath());

        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email: " + e.getMessage());
        }

        return bill;
    }


    // Hàm tạo danh sách ReturnOrderDetail cho từng sản phẩm
    private List<ReturnOrderDetail> createReturnOrderDetails(List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks, ReturnOrder returnOrder) {
        return updateBillDetailGiveBacks.stream().map(data -> {
            ProductDetail productDetail = productDetailRepository.findById(data.getIdProductDetail())
                    .orElseThrow(() -> new RuntimeException("Product detail not found."));

            ReturnOrderDetail existingDetail = returnOrderDetailRepository
                    .findByProductDetailIdAndReturnOrderId(productDetail.getId(), returnOrder.getId());

            if (existingDetail != null) {
                existingDetail.setQuantity(existingDetail.getQuantity() + data.getQuantity());
                existingDetail.setPrice(data.getPrice());
                return existingDetail;
            } else {
                ReturnOrderDetail returnOrderDetail = new ReturnOrderDetail();
                returnOrderDetail.setProductDetail(productDetail);
                returnOrderDetail.setReturnOrder(returnOrder);
                returnOrderDetail.setQuantity(data.getQuantity());
                returnOrderDetail.setStatus(data.getStatus());
                returnOrderDetail.setPrice(data.getPrice());

                productDetail.setQuantityError(data.getQuantityLoi() + productDetail.getQuantityError());
                productDetail.setQuantity(data.getQuantityNham() + productDetail.getQuantity());

                return returnOrderDetail;
            }
        }).collect(Collectors.toList());
    }


}
