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

        // Replacing stream for calculating totalPaymentTraSau
        BigDecimal totalPaymentTraSau = BigDecimal.ZERO;
        for (Payment payment : paymentsMethods) {
            if (payment.getStatus() == StatusPayMents.TRA_SAU) {
                totalPaymentTraSau = totalPaymentTraSau.add(payment.getTotalMoney());
            }
        }

        NumberFormat formatter = formatCurrency();
        BigDecimal totalMoney = bill.getTotalMoney().add(bill.getShippingFee()).subtract(bill.getDiscountAmount());

        InvoiceResponse invoice = InvoiceResponse.builder()
                .phoneNumber(bill.getRecipientPhone())
                .address(bill.getAddress())
                .userName(bill.getRecipientName())
                .code(bill.getCode())
                .ship(formatter.format(bill.getShippingFee()))
                .itemDiscount(formatter.format(bill.getDiscountAmount()))
                .totalMoney(formatter.format(bill.getTotalMoney()))
                .note(bill.getNote())
                .checkShip(true)
                .totalTraSau(formatter.format(totalPaymentTraSau))
                .moneyShip(formatter.format(bill.getShippingFee()))
                .checkBillTra(bill.getInvoiceStatus() == StatusBill.TRA_HANG ? true : false)
                .build();

        invoice.setTotalBill(totalMoney.compareTo(BigDecimal.ZERO) > 0 ? formatter.format(totalMoney) : "0 đ");

        // Replacing stream for calculating total quantity
        int totalQuantity = 0;
        for (BillDetailResponse billDetailResponse : billDetailResponses) {
            totalQuantity += billDetailResponse.getQuantity();
        }
        invoice.setQuantity(totalQuantity);

        // Replacing stream for collecting items
        List<InvoiceItemResponse> items = new ArrayList<>();
//        for (BillDetail billDetailRequest : billDetailResponses) {
//            BigDecimal sum = billDetailRequest.getPromotion() == null
//                    ? billDetailRequest.getPrice().multiply(new BigDecimal(billDetailRequest.getQuantity()))
//                    : new BigDecimal(billDetailRequest.getQuantity())
//                    .multiply(new BigDecimal(100 - billDetailRequest.getPromotion())
//                            .multiply(billDetailRequest.getPrice()).divide(new BigDecimal(100)));
//
//            InvoiceItemResponse invoiceItemResponse = InvoiceItemResponse.builder()
//                    .sum(formatter.format(sum))
//                    .name(billDetailRequest.getProductName())
//                    .priceVn(formatter.format(billDetailRequest.getPromotion() == null
//                            ? billDetailRequest.getPrice()
//                            : billDetailRequest.getPrice().multiply(BigDecimal.valueOf(100 - billDetailRequest.getPromotion())).divide(BigDecimal.valueOf(100))))
//                    .quantity(billDetailRequest.getQuantity())
//                    .promotion(billDetailRequest.getPromotion())
//                    .status(billDetailRequest.getStatus().equals("TRA_HANG") ? "Trả hàng" : "Thành công")
//                    .build();
//
//            if (billDetailRequest.getPromotion() != null) {
//                BigDecimal priceBeforePromotion = billDetailRequest.getPrice().multiply(BigDecimal.ONE.subtract(new BigDecimal(billDetailRequest.getPromotion()).divide(BigDecimal.valueOf(100))));
//                invoiceItemResponse.setPriceBeforePromotion(formatter.format(priceBeforePromotion));
//            }
//
//            items.add(invoiceItemResponse);
//        }
        invoice.setItems(items);

        // Replacing stream for collecting payment method requests
        List<InvoicePaymentResponse> paymentsMethodRequests = new ArrayList<>();
        for (Payment item : paymentsMethods) {
            InvoicePaymentResponse paymentResponse = InvoicePaymentResponse.builder()
                    .total(formatter.format(item.getMethod() == StatusMethod.TIEN_MAT ? item.getTotalMoney().add(totalExcessMoney) : item.getTotalMoney()))
                    .method(getPaymentMethod(item.getMethod()))
                    .status(getPaymentStatus(item.getStatus()))
                    .vnp_TransactionNo(item.getTransactionNo())
                    .build();

            paymentsMethodRequests.add(paymentResponse);
        }
        invoice.setPaymentsMethodRequests(paymentsMethodRequests);

        BigDecimal totalPayment = totalMoney.add(totalExcessMoney);
        invoice.setTotalPayment(formatter.format(totalPayment));

        BigDecimal change = totalExcessMoney;
        invoice.setChange(formatter.format(change));

        invoice.setMethod(!findAllPaymentByIdBillAndMethod.isEmpty());
        invoice.setTypeBill(false);

        Date date = new Date(bill.getUpdatedAt().getTime());
        SimpleDateFormat formatterDate = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        invoice.setDate(formatterDate.format(date));

        try {
            invoice.setQr(qrFuture.join());
            return CompletableFuture.completedFuture(invoice).get();
        } catch (InterruptedException | ExecutionException e) {
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
