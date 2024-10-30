package com.example.be.services.impl;

import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.request.voucher.VoucherRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.dto.admin.response.voucher.VoucherCustomerRepository;
import com.example.be.dto.admin.response.voucher.VoucherResponse;
import com.example.be.entities.Customer;
import com.example.be.entities.Voucher;
import com.example.be.entities.VoucherCustomer;
import com.example.be.repositories.admin.CustomerRepository;
import com.example.be.repositories.admin.VoucherRepository;
import com.example.be.services.VoucherService;
import com.example.be.utils.MailUtils;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.VoucherConstant;
import com.example.be.utils.converter.VoucherConvert;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Locale;

/**
 * @author ninhncph40535
 *
 */
@Service
public class VoucherServiceImpl implements VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private CustomerRepository accountRepository;
    @Autowired
    private VoucherCustomerRepository accountVoucherRepository;

    @Autowired
    private VoucherConvert voucherConvert;

    @Autowired
    private MailUtils mailUtils;


    private String genCode() {
        String prefix = "VBS0";
        int x = 1;
        String code = prefix + x;
        while (voucherRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public List<VoucherResponse> getAccountVoucher(Integer id, VoucherRequest request) {
        return voucherRepository.getAccountVoucher(id, request);
    }

    @Override
    public List<VoucherResponse> getPublicVoucher(VoucherRequest request) {
        return voucherRepository.getPublicVoucher(request);
    }

    @Override
    public List<VoucherCustomer> getFind(Integer id) {
        return accountVoucherRepository.findByVoucherId(id);
    }

    @Override
    public PageableObject<VoucherResponse> getAll(VoucherRequest request) {
        return new PageableObject<>(voucherRepository.getAllVoucher(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }

    @Override
    public VoucherResponse getOne(Integer id) {
        for (Voucher voucher : voucherRepository.findAll()) {
            updateStatus(voucher);
        }
        return voucherRepository.getOneVoucher(id);
    }

    public static String formatCurrency(BigDecimal amount) {
        Locale localeVN = new Locale("vi", "VN");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
        return currencyFormatter.format(amount);
    }

    private void sendVoucherEmail(Customer customer, Voucher voucherSave) {
        String emailContent = "Chúc mừng bạn đã nhận được phiếu giảm giá!\n\n"
                + "Chào " + customer.getFullName() + ",\n\n"
                + "Chúng tôi rất vui mừng thông báo rằng bạn đã nhận được phiếu giảm giá từ Berry Store!\n\n"
                + "Dưới đây là thông tin chi tiết về phiếu giảm giá của bạn:\n"
                + "Mã phiếu giảm giá: " + voucherSave.getCode() + "\n"
                + "Giá trị giảm giá: " + voucherSave.getDiscountValue() + "%\n"
                + "Ngày hết hạn: " + voucherSave.getEndDate() + "\n"
                + "Điều kiện áp dụng:\n"
                + "  - Giá trị tối thiểu: " + formatCurrency(voucherSave.getMinOrderValue()) + "\n"
                + "  - Giá trị tối đa: " + formatCurrency(voucherSave.getMaxDiscountValue()) + "\n\n"
                + "Hãy sử dụng mã này để được giảm giá khi mua sắm tại cửa hàng hoặc trên trang web của chúng tôi.\n\n"
                + "Đây là email tự động, vui lòng không trả lời email này.\n\n"
                + "Cảm ơn bạn đã ủng hộ Berry Store.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ Berry Store\n\n"
                + "Liên hệ: https://www.facebook.com/ninh.cong.9889";

        mailUtils.sendEmail(customer.getEmail(), "Thông tin phiếu giảm giá từ Berry Store", emailContent);
    }


    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public Voucher add(VoucherRequest request) {
        //chỗ check trống
        if (request.getName().isEmpty()) {
            throw new RestApiException("Tên phiếu giảm giá không được để trống!");
        }
        if (request.getQuantity() == null) {
            throw new RestApiException("Số lượng không được để trống!");
        }
        if (request.getDiscountValue() == null) {
            throw new RestApiException("Giá trị giảm không được để trống!");
        }
        if (request.getMinOrderValue() == null) {
            throw new RestApiException("Giá trị tối thiểu không được để trống!");
        }
        if (request.getStartDate() == null) {
            throw new RestApiException("Ngày bắt đầu không được để trống!");
        }
        if (request.getEndDate() == null) {
            throw new RestApiException("Ngày kết thúc không được để trống!");
        }
        //chỗ để check khác
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự!");
        }
        if (request.getType().equals("Công khai")) {
            if (request.getQuantity() <= 0) {
                throw new RestApiException("Số lượng phải lớn hơn 0!");
            }
            if (request.getQuantity() <= 0 || request.getQuantity() != (int) request.getQuantity() || request.getQuantity() == null) {
                throw new RestApiException("Số lượng phải là số nguyên dương!");
            }
            if (request.getQuantity() > 10000) {
                throw new RestApiException("Số lượng không được vượt quá 10000! ");
            }
        }


        if (request.getDiscountMethod().equals("%")) {
            try {

                BigDecimal maxValue = new BigDecimal("50");

                if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0 || request.getDiscountValue().compareTo(maxValue) > 0) {
                    throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50!");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50!");
            } catch (RestApiException e) {
                throw e;
            }
        } else {
            try {
                BigDecimal maxValue = new BigDecimal("2000000000");

                if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0 || request.getDiscountValue().compareTo(maxValue) > 0) {
                    throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
            } catch (RestApiException e) {
                throw e;
            }
        }
        if (request.getMinOrderValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Giá trị tối thiểu phải lớn hơn hoặc bằng 0! ");
        }
        if (request.getMaxDiscountValue() != null) {
            if (request.getMaxDiscountValue().compareTo(BigDecimal.ZERO) < 0) {
                throw new RestApiException("Đơn tối đa phải lớn hơn hoặc bằng 0!");
            }
        }
        LocalDateTime startDateTime = request.getStartDate();
        LocalDateTime endDateTime = request.getEndDate();
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneOffset.UTC);

        if (startDateTime.isAfter(endDateTime)) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
        }
        if (startDateTime.isBefore(currentDateTime)) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi!");
        }
        if (startDateTime.isEqual(endDateTime)) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc!");
        }


        Voucher voucher = voucherConvert.converRequestToEntity(request);
        voucher.setDeleted(false);
        if (voucher.getCode() == null || voucher.getCode().isEmpty()) {
            voucher.setCode(genCode());
        }
        Voucher voucherSave = voucherRepository.save(voucher);

        updateStatus(voucherSave);
        System.out.println(request);
        if (voucherSave.getType().equals("Cá nhân")) {
            if (!request.getCustomers().isEmpty()) {
                request.getCustomers().forEach(customerId -> {
                    VoucherCustomer accountVoucher = new VoucherCustomer();
                    Customer account = accountRepository.findById(customerId).get();
                    accountVoucher.setVoucher(voucherSave);
                    accountVoucher.setCustomer(account);
                    accountVoucher.setStatus(VoucherConstant.CHUA_SU_DUNG);
                    accountVoucherRepository.save(accountVoucher);
                    this.sendVoucherEmail(account, voucherSave);
                });
            }
        }
        return voucher;
    }

    @Override
    public Voucher update(Integer id, VoucherRequest request) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);

        if (voucherToUpdate == null) {
            throw new RestApiException("Phiếu giảm giá không tồn tại!");
        }

        // Validation checks
        if (request.getName().isEmpty()) {
            throw new RestApiException("Tên phiếu giảm giá không được để trống!");
        }
        if (request.getQuantity() == null) {
            throw new RestApiException("Số lượng không được để trống!");
        }
        if (request.getDiscountValue() == null) {
            throw new RestApiException("Giá trị giảm không được để trống!");
        }
        if (request.getMinOrderValue() == null) {
            throw new RestApiException("Giá trị tối thiểu không được để trống!");
        }
        if (request.getStartDate() == null) {
            throw new RestApiException("Ngày bắt đầu không được để trống!");
        }
        if (request.getEndDate() == null) {
            throw new RestApiException("Ngày kết thúc không được để trống!");
        }

        // Additional checks
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự!");
        }
        if (request.getType().equals("Công khai")) {
            if (request.getQuantity() <= 0) {
                throw new RestApiException("Số lượng phải lớn hơn 0!");
            }
            if (request.getQuantity() > 10000) {
                throw new RestApiException("Số lượng không được vượt quá 10000!");
            }
        }

        if (request.getDiscountMethod().equals("%")) {
            BigDecimal maxValue = new BigDecimal("50");
            if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0 || request.getDiscountValue().compareTo(maxValue) > 0) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50!");
            }
        } else {
            BigDecimal maxValue = new BigDecimal("2000000000");
            if (request.getDiscountValue().compareTo(BigDecimal.ONE) <= 0 || request.getDiscountValue().compareTo(maxValue) > 0) {
                throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
            }
        }

        if (request.getMinOrderValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0!");
        }
        if (request.getMaxDiscountValue() != null) {
            if (request.getMaxDiscountValue().compareTo(BigDecimal.ZERO) < 0) {
                throw new RestApiException("Đơn tối đa phải lớn hơn hoặc bằng 0!");
            }
        }

        LocalDateTime startDateTime = request.getStartDate();
        LocalDateTime endDateTime = request.getEndDate();
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneOffset.UTC);

        if (startDateTime.isAfter(endDateTime)) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
        }
        if (startDateTime.isBefore(currentDateTime)) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi!");
        }
        if (endDateTime.isBefore(currentDateTime)) {
            throw new RestApiException("Ngày giờ kết thúc phải từ ngày hiện tại trở đi!");
        }
        if (startDateTime.isEqual(endDateTime)) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc!");
        }

        List<VoucherCustomer> existingVouchers = accountVoucherRepository.findByVoucher(voucherToUpdate);
        existingVouchers.forEach(existingVoucher -> {
            if (!request.getCustomers().contains(existingVouchers)) {
                accountVoucherRepository.delete(existingVoucher);
                String emailContent = "Thông báo về việc xóa phiếu giảm giá\n\n"
                        + "Chào " + existingVoucher.getCustomer().getEmail() + ",\n\n"
                        + "Chúng tôi rất tiếc thông báo rằng phiếu giảm giá của bạn từ Berry Store đã bị hủy bỏ.\n"
                        + "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\n"
                        + "Đây là email tự động, vui lòng không trả lời email này.\n\n"
                        + "Cảm ơn bạn đã ủng hộ BerryStore.\n"
                        + "Trân trọng,\n"
                        + "Đội ngũ BerryStore\n\n"
                        + "Liên hệ: https://www.facebook.com/ninh.cong.9889";

                mailUtils.sendEmail(existingVoucher.getCustomer().getEmail(), "Thông báo về việc xóa phiếu giảm giá từ BerryStore", emailContent);
            }
        });

        Voucher voucherSave = voucherRepository.save(voucherConvert.convertRequestToEntity(id, request));

        if (voucherSave != null) {
            this.updateStatus(voucherToUpdate);
        }

        if (voucherSave.getType().equals("Cá nhân")) {
            if (request.getCustomers() != null && !request.getCustomers().isEmpty()) {
//                accountVoucherRepository.deleteAll(accountVoucherRepository.findByVoucherId(voucherSave.getId()));
                request.getCustomers().forEach(customerId -> {
                    accountRepository.findById(customerId).ifPresent(account -> {
                        VoucherCustomer accountVoucher = new VoucherCustomer();
                        accountVoucher.setVoucher(voucherSave);
                        accountVoucher.setCustomer(account);
                        accountVoucher.setStatus(VoucherConstant.CHUA_SU_DUNG);
                        accountVoucherRepository.save(accountVoucher);
                        this.sendVoucherEmail(account, voucherSave);
                    });
                });
            }
        } else {
            accountVoucherRepository.deleteAll(accountVoucherRepository.findByVoucher(voucherSave));
        }

        return voucherSave;
    }


    @Override
    public String delete(Integer id) {
        voucherRepository.deleteById(id);
        return "Xóa oke";
    }

    @Override
    public boolean isVoucherCodeExists(String code) {
        return voucherRepository.existsByCode(code);
    }

    public void updateStatusVoucher() {
        List<Voucher> vouchers = voucherRepository.findAll();
//        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
        LocalDateTime currentDateTime = LocalDateTime.now();
//        OffsetDateTime currentDateTime = OffsetDateTime.now(ZoneOffset.UTC);
        for (Voucher voucher : vouchers) {
            System.out.println("Current DateTime: " + currentDateTime);

            LocalDateTime startDateTime = voucher.getStartDate();
            LocalDateTime endDateTime = voucher.getEndDate();
            if (voucher.getQuantity() == null || voucher.getQuantity() == 0) {
                voucher.setStatus(VoucherConstant.DA_KET_THUC);
            } else {
                if (currentDateTime.isBefore(startDateTime)) {
                    voucher.setStatus(VoucherConstant.SAP_DIEN_RA);
                } else if (currentDateTime.isAfter(startDateTime) && currentDateTime.isBefore(endDateTime)) {
                    voucher.setStatus(VoucherConstant.DANG_DIEN_RA);
                } else {
                    voucher.setStatus(VoucherConstant.DA_KET_THUC);
                }
                if (endDateTime.isEqual(startDateTime)) {
                    voucher.setStatus(VoucherConstant.DA_KET_THUC);
                }
            }


            voucherRepository.save(voucher);
        }
    }


    @Override
    public Voucher updateEndDate(Integer id) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);
        if (voucherToUpdate == null) {
            throw new RestApiException("Phiếu giảm giá không tồn tại.");
        }

        LocalDateTime currentDateTime = LocalDateTime.now();

        if (voucherToUpdate.getStatus().equals(VoucherConstant.DA_KET_THUC)) {
            throw new RestApiException("Phiếu giảm giá này đã kết thúc rồi!");
        }

        if (voucherToUpdate.getStatus().equals(VoucherConstant.SAP_DIEN_RA)) {
            LocalDateTime startDate = LocalDateTime.now().with(LocalTime.MIN);
            voucherToUpdate.setStartDate(startDate);
        }

        voucherToUpdate.setEndDate(currentDateTime);
        voucherToUpdate.setStatus(VoucherConstant.DA_KET_THUC);

        // Lưu voucher và gửi email thông báo
        Voucher savedVoucher = voucherRepository.save(voucherToUpdate);

        // Lấy danh sách khách hàng có trạng thái voucher "Chưa sử dụng"
        List<VoucherCustomer> customerVouchers = accountVoucherRepository.findByIdPhieuGiamGiaAndTrangThai(savedVoucher.getId(), "DA_KET_THUC");

        // Gửi email thông báo cho từng khách hàng
        for (VoucherCustomer customerVoucher : customerVouchers) {
            Customer customer = customerVoucher.getCustomer();
            String emailContent = generateEmailContent(savedVoucher, customer);
            mailUtils.sendEmail(customer.getEmail(), "Thông báo phiếu giảm giá kết thúc sớm", emailContent);
        }

        return savedVoucher;
    }

    // Phương thức tạo nội dung email
    private String generateEmailContent(Voucher voucher, Customer customer) {
        return "Thông báo phiếu giảm giá kết thúc sớm\n\n"
                + "Chào " + customer.getEmail() + ",\n\n"
                + "Chúng tôi rất tiếc thông báo rằng phiếu giảm giá của bạn đã kết thúc sớm.\n\n"
                + "Dưới đây là thông tin chi tiết về phiếu giảm giá của bạn:\n"
                + "Mã phiếu giảm giá: " + voucher.getCode() + "\n"
                + "Giá trị giảm giá: " + voucher.getDiscountValue() + "%\n"
                + "Ngày hết hạn: " + voucher.getEndDate() + "\n"
                + "Điều kiện áp dụng: " + formatCurrency(voucher.getMinOrderValue()) + "\n\n"
                + "Cảm ơn bạn đã ủng hộ BerryStore.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ BerryStore\n\n"
                + "Liên hệ: https://www.facebook.com/ninh.cong.9889";
    }


    @Override
    public PageableObject<CustomerResponse> findCustomer(CustomerRequest request) {
        return new PageableObject<>(accountRepository.getAllCustomer(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }

    @Override
    public PageableObject<CustomerResponse> findVoucherCustomer(Integer id, CustomerRequest request) {
        return new PageableObject<>(accountRepository.getAllCustomerID(id, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }


    public void updateStatus(Voucher voucher) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        System.out.println("Current DateTime: " + currentDateTime);

        LocalDateTime startDateTime = voucher.getStartDate();
        LocalDateTime endDateTime = voucher.getEndDate();

        if (currentDateTime.isBefore(startDateTime)) {
            voucher.setStatus(VoucherConstant.SAP_DIEN_RA); // Chưa bắt đầu
        } else if (currentDateTime.isAfter(startDateTime) && currentDateTime.isBefore(endDateTime)) {
            voucher.setStatus(VoucherConstant.DANG_DIEN_RA); // Đang diễn ra
        } else {
            voucher.setStatus(VoucherConstant.DA_KET_THUC); // Đã kết thúc
        }

        voucherRepository.save(voucher);
    }
}