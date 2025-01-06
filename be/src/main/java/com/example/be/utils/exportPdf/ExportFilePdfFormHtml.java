package com.example.be.utils.exportPdf;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequestOne;
import com.example.be.dto.admin.response.bill.InvoiceItemResponse;
import com.example.be.dto.admin.response.bill.InvoicePaymentResponse;
import com.example.be.dto.admin.response.bill.InvoiceResponse;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import com.example.be.entities.Payment;
import com.example.be.repositories.admin.BillDetailRepository;
import com.example.be.repositories.admin.PaymentRepository;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import com.example.be.utils.constant.StatusBill;
import com.example.be.utils.constant.StatusMethod;
import com.example.be.utils.constant.StatusPayMents;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfWriter;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * @author hanthanh
 */
@Component
public class ExportFilePdfFormHtml {

    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private PaymentRepository paymentsMethodRepository;

    @Autowired
    private CloudinaryUtil qrCodeAndCloudinary;

    @Autowired
    private ServletContext servletContext;

    public Context setData(InvoiceResponse invoice) {

        Context context = new Context();

        Map<String, Object> data = new HashMap<>();

        data.put("invoice", invoice);

        context.setVariables(data);

        return context;
    }

    public Context setDataSendMail(InvoiceResponse invoice, String url) {

        Context context = new Context();

        Map<String, Object> data = new HashMap<>();

        data.put("invoice", invoice);
        data.put("url", url);
        context.setVariables(data);

        return context;
    }

    public String htmlToPdf(String processedHtml, String code) {

        String downloadPath = System.getProperty("user.home") + "/Downloads";

        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
             PdfWriter pdfwriter = new PdfWriter(byteArrayOutputStream)) {

            DefaultFontProvider defaultFont = new DefaultFontProvider(false, true, false);
            ConverterProperties converterProperties = new ConverterProperties();
            converterProperties.setFontProvider(defaultFont);

            HtmlConverter.convertToPdf(processedHtml, pdfwriter, converterProperties);

            byte[] pdfBytes = byteArrayOutputStream.toByteArray();
            Files.copy(new ByteArrayInputStream(pdfBytes), Paths.get(downloadPath, code + ".pdf"), StandardCopyOption.REPLACE_EXISTING);

        } catch (IOException ex) {
            // Xử lý ngoại lệ khi có lỗi I/O
            ex.printStackTrace();
        }
        return null;
    }

    public NumberFormat formatCurrency() {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN"));
        formatter.setCurrency(Currency.getInstance("VND"));
        return formatter;
    }


    public InvoiceResponse getInvoiceResponse(Bill bill, BigDecimal totalExcessMoney) {
        CompletableFuture<String> qrFuture = CompletableFuture.supplyAsync(() -> qrCodeAndCloudinary.generateAndUploadQRCode(bill.getCode()));

        List<BillDetailResponse> billDetailResponses = billDetailRepository.findByIdBill(new BillDetailRequestOne(bill.getId()));
        List<Payment> paymentsMethods = paymentsMethodRepository.findAllByBill(bill);
        List<Integer> findAllPaymentByIdBillAndMethod = paymentsMethodRepository.findAllPayMentByIdBillAndMethod(bill.getId());

        BigDecimal totalPaymentTraSau = paymentsMethods.stream()
                .filter(payment -> payment.getStatus() == StatusPayMents.TRA_SAU)
                .map(Payment::getTotalMoney)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        NumberFormat formatter = formatCurrency();
        BigDecimal totalMoney =
                (bill.getTotalMoney())
                        .add(bill.getShippingFee())
                        .subtract(bill.getDiscountAmount() != null ? bill.getDiscountAmount() : BigDecimal.ZERO)
                ;

        InvoiceResponse invoice = InvoiceResponse.builder()
                .recipientPhone(bill.getRecipientPhone())
                .address(bill.getAddress())
                .recipientName(bill.getRecipientName())
                .code(bill.getCode())
                .discountPrice(String.valueOf((bill.getDiscountAmount())))
                .totalMoney(formatter.format(((bill.getTotalMoney()))))
                .note(bill.getNote())
                .checkShip(true)
                .totalTraSau(formatter.format(totalPaymentTraSau))
                .moneyShip(formatter.format(bill.getShippingFee()))
                .checkBillTra(bill.getInvoiceStatus() == StatusBill.TRA_HANG ? true : false)
                .build();

        invoice.setTotalBill(totalMoney.compareTo(BigDecimal.ZERO) > 0 ? formatter.format(totalMoney) : "0 đ");
        invoice.setQuantity(billDetailResponses.stream()
                .mapToInt(BillDetailResponse::getQuantity)
                .sum());
        List<InvoiceItemResponse> items = billDetailResponses.stream()
                .map(billDetailRequest -> {
                    // Lấy giá và số lượng an toàn
                    BigDecimal price = (billDetailRequest.getPrice() != null)
                            ? billDetailRequest.getPrice()
                            : (billDetailRequest.getDiscountPrice() != null)
                            ? billDetailRequest.getDiscountPrice()
                            : (billDetailRequest.getNewPrice() != null)
                            ? billDetailRequest.getNewPrice()
                            : billDetailRequest.getOldPrice();

                    System.out.println("Price from request: " + billDetailRequest.getPrice());
                    System.out.println("Price from request1: " + billDetailRequest.getDiscountPrice());
                    System.out.println("Price from request2: " + billDetailRequest.getNewPrice());
                    System.out.println("Price from request3: " + billDetailRequest.getOldPrice());

                    int quantity = Optional.ofNullable(billDetailRequest.getQuantity()).orElse(0);
                    BigDecimal promotion = Optional.ofNullable(billDetailRequest.getPromotion())
                            .map(BigDecimal::valueOf)
                            .orElse(BigDecimal.ZERO);

                    // Tính tổng an toàn
                    BigDecimal sum = price.multiply(BigDecimal.valueOf(quantity));
                    if (promotion.compareTo(BigDecimal.ZERO) > 0) {
                        sum = price.multiply(BigDecimal.ONE.subtract(promotion.divide(BigDecimal.valueOf(100))))
                                .multiply(BigDecimal.valueOf(quantity));
                    }

                    // Tạo đối tượng InvoiceItemResponse
                    InvoiceItemResponse invoiceItemResponse = InvoiceItemResponse.builder()
                            .name(billDetailRequest.getProductName())
                            .price(formatter.format(price)) // Định dạng giá
                            .quantity(quantity)
                            .promotion(billDetailRequest.getPromotion())
                            .sum(formatter.format(sum)) // Định dạng tổng
                            .status("TRA_HANG".equals(billDetailRequest.getStatus()) ? "Trả hàng" : "Thành công")
                            .build();

                    // Tính giá sau khuyến mãi và thêm vào nếu có promotion
                    if (promotion.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal discountPrice = price.multiply(BigDecimal.ONE.subtract(promotion.divide(BigDecimal.valueOf(100))));
                        invoiceItemResponse.setDiscountPrice(formatter.format(discountPrice));
                    }

                    return invoiceItemResponse;
                })
                .collect(Collectors.toList());


        List<InvoicePaymentResponse> paymentsMethodRequests = paymentsMethods.stream()
                .map(item -> InvoicePaymentResponse.builder()
                        .totalMoney(formatter.format(item.getMethod() == StatusMethod.TIEN_MAT  ? item.getTotalMoney() : item.getTotalMoney()))
                        .method(getPaymentMethod(item.getMethod()))
                        .status(getPaymentStatus(item.getStatus()))
                        .transactionNo(item.getTransactionNo())
                        .build())
                .collect(Collectors.toList());

        BigDecimal totalMoney1 = bill.getTotalMoney().compareTo(BigDecimal.ZERO) > 0 ? (bill.getTotalMoney())
                .add(bill.getShippingFee())
                .subtract(bill.getDiscountAmount() != null ? bill.getDiscountAmount() : BigDecimal.ZERO): BigDecimal.ZERO;
        BigDecimal totalExcessMoneySafe = totalExcessMoney.compareTo(BigDecimal.ZERO) > 0 ? totalExcessMoney : BigDecimal.ZERO;

        invoice.setTotalPayment(formatter.format(totalExcessMoneySafe));

// Tính toán tiền thừa (change)
        BigDecimal change;
        if (totalExcessMoney.compareTo(totalMoney1) > 0) {
            change = totalExcessMoney.subtract(totalMoney1);
        } else {
            change = totalMoney1.subtract(totalExcessMoney);
        }
        invoice.setChange(formatter.format(change));



        invoice.setPaymentsMethodRequests(paymentsMethodRequests);
        invoice.setItems(items);



        invoice.setMethod(!findAllPaymentByIdBillAndMethod.isEmpty());
        invoice.setTypeBill(false);

        Date date = (bill.getUpdatedAt());
        SimpleDateFormat formatterDate = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        invoice.setDate(formatterDate.format(date));

        try {
            invoice.setQr(qrFuture.join());
            return CompletableFuture.completedFuture(invoice).get();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    private String getPaymentMethod(StatusMethod method) {
        return method == StatusMethod.TIEN_MAT ? "Tiền mặt" : method == StatusMethod.CHUYEN_KHOAN ? "Chuyển khoản" : "Thẻ";
    }

    private String getPaymentStatus(StatusPayMents status) {
        return status == StatusPayMents.THANH_TOAN ? "Thanh toán" : status == StatusPayMents.TRA_SAU ? "Trả sau" : "Hoàn tiền";
    }


}
