package com.example.be.service.impl;

import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.KhachHang;
import com.example.be.entity.PhieuGiamGia;
import com.example.be.entity.PhieuGiamGiaKhachHang;
import com.example.be.repository.KhachHangRepository;
import com.example.be.repository.PhieuGiamGiaKhachHangRepository;
import com.example.be.repository.PhieuGiamGiaRepository;
import com.example.be.service.PhieuGiamGiaService;
import com.example.be.util.MailUtils;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.PhieuGiamGiaConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;
/**
 * @author ninhncph40535
 *
 */

@Service
public class PhieuGiamGiaImpl implements PhieuGiamGiaService {
    @Autowired
    private PhieuGiamGiaRepository voucherRepository;
    @Autowired
    private KhachHangRepository accountRepository;
    @Autowired
    private PhieuGiamGiaKhachHangRepository accountVoucherRepository;

    @Autowired
    private PhieuGiamGiaConvert voucherConvert;

    @Autowired
    private MailUtils mailUtils;


    private String genCode() {
        String prefix = "VBS0";
        int x = 1;
        String code = prefix + x;
        while (voucherRepository.existsByMa(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public List<PhieuGiamGiaResponse> getAccountVoucher(Integer id, PhieuGiamGiaRequest request) {
        return voucherRepository.getAccountVoucher(id, request);
    }

    @Override
    public List<PhieuGiamGiaResponse> getPublicVoucher(PhieuGiamGiaRequest request) {
        return voucherRepository.getPublicVoucher(request);
    }

    @Override
    public List<PhieuGiamGiaKhachHang> getFind(Integer id) {
        return accountVoucherRepository.findByVoucherId(id);
    }

    @Override
    public PageableObject<PhieuGiamGiaResponse> getAll(PhieuGiamGiaRequest request) {
        return new PageableObject<>(voucherRepository.getAllVoucher(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }

    @Override
    public PhieuGiamGiaResponse getOne(Integer id) {
        for (PhieuGiamGia voucher : voucherRepository.findAll()) {
            updateStatus(voucher);
        }
        return voucherRepository.getOneVoucher(id);
    }

    public static String formatCurrency(BigDecimal amount) {
        Locale localeVN = new Locale("vi", "VN");
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(localeVN);
        return currencyFormatter.format(amount);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public PhieuGiamGia add(PhieuGiamGiaRequest request) {
        //chỗ check trống
        if (request.getTen().isEmpty()) {
            throw new RestApiException("Tên phiếu giảm giá không được để trống!");
        }
        if (request.getSoLuong() == null) {
            throw new RestApiException("Số lượng không được để trống!");
        }
        if (request.getGiaTriHoaDonDuocGiam() == null) {
            throw new RestApiException("Giá trị giảm không được để trống!");
        }
        if (request.getGiaTriHoaDonDuocApDung() == null) {
            throw new RestApiException("Giá trị tối thiểu không được để trống!");
        }
        if (request.getNgayBatDau() == null) {
            throw new RestApiException("Ngày bắt đầu không được để trống!");
        }
        if (request.getNgayKetThuc() == null) {
            throw new RestApiException("Ngày kết thúc không được để trống!");
        }
        //chỗ để check khác
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự!");
        }
        if (request.getLoai().equals("Công khai")) {
            if (request.getSoLuong() <= 0) {
                throw new RestApiException("Số lượng phải lớn hơn 0!");
            }
            if (request.getSoLuong() <= 0 || request.getSoLuong() != (int) request.getSoLuong() || request.getSoLuong() == null) {
                throw new RestApiException("Số lượng phải là số nguyên dương!");
            }
            if (request.getSoLuong() > 10000) {
                throw new RestApiException("Số lượng không được vượt quá 10000! ");
            }
        }


        if (request.getHinhThucGiam().equals("%")) {
            try {

                BigDecimal maxValue = new BigDecimal("50");

                if (request.getGiaTriHoaDonDuocGiam().compareTo(BigDecimal.ZERO) <= 0 || request.getGiaTriHoaDonDuocGiam().compareTo(maxValue) > 0) {
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

                if (request.getGiaTriHoaDonDuocGiam().compareTo(BigDecimal.ZERO) <= 0 || request.getGiaTriHoaDonDuocGiam().compareTo(maxValue) > 0) {
                    throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
            } catch (RestApiException e) {
                throw e;
            }
        }
        if (request.getGiaTriHoaDonDuocApDung().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Giá trị tối thiểu phải lớn hơn hoặc bằng 0! ");
        }
        LocalDateTime startDateTime = request.getNgayBatDau();
        LocalDateTime endDateTime = request.getNgayKetThuc();
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


        PhieuGiamGia voucher = voucherConvert.converRequestToEntity(request);
        voucher.setDeleted(false);
        if (voucher.getMa().isEmpty()) {
            voucher.setMa(genCode());
        }
        PhieuGiamGia voucherSave = voucherRepository.save(voucher);

        updateStatus(voucherSave);
        System.out.println(request);
        if (voucherSave.getLoai().equals("Cá nhân")) {
            if (!request.getCustomers().isEmpty()) {
                request.getCustomers().forEach(customerId -> {
                    PhieuGiamGiaKhachHang accountVoucher = new PhieuGiamGiaKhachHang();
                    KhachHang account = accountRepository.findById(customerId).get();
                    accountVoucher.setIdPhieuGiamGia(voucherSave);
                    accountVoucher.setIdKhachHang(account);
                    accountVoucher.setTrangThai("Chưa sử dụng");
                    accountVoucherRepository.save(accountVoucher);
                    String emailContent = "Chúc mừng bạn đã nhận được phiếu giảm giá!\n\n"
                            + "Chào " + account.getEmail() + ",\n\n"
                            + "Chúng tôi rất vui mừng thông báo rằng bạn đã nhận được phiếu giảm giá từ Berry Store!\n"
                            + "Dưới đây là thông tin chi tiết về phiếu giảm giá của bạn:\n\n"
                            + "- Mã phiếu giảm giá: " + voucherSave.getMa() + "\n"
                            + "- Giá trị giảm giá: " + voucherSave.getGiaTriHoaDonDuocGiam() + "%\n"
                            + "- Ngày hết hạn: " + voucherSave.getNgayKetThuc() + "\n"
                            + "- Điều kiện áp dụng: " + this.formatCurrency(voucherSave.getGiaTriHoaDonDuocApDung()) + "\n\n"
                            + "Hãy sử dụng mã này để được giảm giá khi mua sắm tại cửa hàng hoặc trên trang web của chúng tôi.\n\n"
                            + "Đây là email tự động, vui lòng không trả lời email này.\n\n"
                            + "Cảm ơn bạn đã ủng hộ Berry Store.\n"
                            + "Chúc bạn một ngày tốt lành!\n\n"
                            + "Trân trọng,\n"
                            + "Đội ngũ BerryStore\n\n"
                            + "Liên hệ: https://www.facebook.com/ninh.cong.9889";

                    mailUtils.sendEmail(account.getEmail(), "Thông tin phiếu giảm giá từ BerryStore", emailContent);

                });
            }
        }
        return voucher;
    }

    @Override
    public PhieuGiamGia update(Integer id, PhieuGiamGiaRequest request) {
        PhieuGiamGia voucherToUpdate = voucherRepository.findById(id).orElse(null);
        //chỗ check trống
        if (request.getTen().isEmpty()) {
            throw new RestApiException("Tên phiếu giảm giá không được để trống!");
        }
        if (request.getSoLuong() == null) {
            throw new RestApiException("Số lượng không được để trống!");
        }
        if (request.getGiaTriHoaDonDuocGiam() == null) {
            throw new RestApiException("Giá trị giảm không được để trống!");
        }
        if (request.getGiaTriHoaDonDuocApDung() == null) {
            throw new RestApiException("Giá trị tối thiểu không được để trống!");
        }
        if (request.getNgayBatDau() == null) {
            throw new RestApiException("Ngày bắt đầu không được để trống!");
        }
        if (request.getNgayKetThuc() == null) {
            throw new RestApiException("Ngày kết thúc không được để trống!");
        }
        //chỗ để check khác
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự!");
        }
        if (request.getLoai().equals("Công khai")) {
            if (request.getSoLuong() <= 0) {
                throw new RestApiException("Số lượng phải lớn hơn 0!");
            }
            if (request.getSoLuong() <= 0 || request.getSoLuong() != (int) request.getSoLuong() || request.getSoLuong() == null) {
                throw new RestApiException("Số lượng phải là số nguyên dương!");
            }
            if (request.getSoLuong() > 10000) {
                throw new RestApiException("Số lượng không được vượt quá 10000!");
            }
        }


        if (request.getHinhThucGiam().equals("%")) {
            try {

                BigDecimal maxValue = new BigDecimal("50");

                if (request.getGiaTriHoaDonDuocGiam().compareTo(BigDecimal.ZERO) <= 0 || request.getGiaTriHoaDonDuocGiam().compareTo(maxValue) > 0) {
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

                if (request.getGiaTriHoaDonDuocGiam().compareTo(BigDecimal.ONE) <= 0 || request.getGiaTriHoaDonDuocGiam().compareTo(maxValue) > 0) {
                    throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Giá trị giảm phải nằm trong khoảng từ 1 đến 2,000,000,000!");
            } catch (RestApiException e) {
                throw e;
            }
        }


        if (request.getGiaTriHoaDonDuocApDung().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0!");
        }
        LocalDateTime startDateTime = request.getNgayBatDau();
        LocalDateTime endDateTime = request.getNgayKetThuc();
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
        PhieuGiamGia voucherSave = voucherRepository.save(voucherConvert.convertRequestToEntity(id, request));
        if (voucherSave != null) {
            this.updateStatus(voucherToUpdate);
        }
        if (voucherSave.getLoai().equals("Cá nhân")) {
            if (!request.getCustomers().isEmpty()) {
                request.getCustomers().forEach(customerId -> {
                    PhieuGiamGiaKhachHang accountVoucher = new PhieuGiamGiaKhachHang();
                    KhachHang account = accountRepository.findById(customerId).get();
                    accountVoucher.setIdPhieuGiamGia(voucherSave);
                    accountVoucher.setIdKhachHang(account);
                    accountVoucher.setTrangThai("Chưa sử dụng");
                    accountVoucherRepository.save(accountVoucher);
                    String emailContent = "Chúc mừng bạn đã nhận được phiếu giảm giá!\n\n"
                            + "Chào " + account.getEmail() + ",\n\n"
                            + "Chúng tôi rất vui mừng thông báo rằng bạn đã nhận được phiếu giảm giá từ Berry Store!\n"
                            + "Dưới đây là thông tin chi tiết về phiếu giảm giá của bạn:\n\n"
                            + "- Mã phiếu giảm giá: " + voucherSave.getMa() + "\n"
                            + "- Giá trị giảm giá: " + voucherSave.getGiaTriHoaDonDuocGiam() + "%\n"
                            + "- Ngày hết hạn: " + voucherSave.getNgayKetThuc() + "\n"
                            + "- Điều kiện áp dụng: " + this.formatCurrency(voucherSave.getGiaTriHoaDonDuocApDung()) + "\n\n"
                            + "Hãy sử dụng mã này để được giảm giá khi mua sắm tại cửa hàng hoặc trên trang web của chúng tôi.\n\n"
                            + "Đây là email tự động, vui lòng không trả lời email này.\n\n"
                            + "Cảm ơn bạn đã ủng hộ BerryStore.\n"
                            + "Chúc bạn một ngày tốt lành!\n\n"
                            + "Trân trọng,\n"
                            + "Đội ngũ BerryStore\n\n"
                            + "Liên hệ: https://www.facebook.com/ninh.cong.9889";

                    mailUtils.sendEmail(account.getEmail(), "Thông tin phiếu giảm giá từ BerryStore", emailContent);

                });
            }
        }
//        else {
//            accountVoucherRepository.deleteAll(accountVoucherRepository.findByVoucherId(voucherSave.getId()));
//        }
        return voucherSave;
    }


    @Override
    public String delete(Integer id) {
        voucherRepository.deleteById(id);
        return "Xóa oke";
    }

    @Override
    public boolean isVoucherCodeExists(String code) {
        return voucherRepository.existsByMa(code);
    }

    public void updateStatusVoucher() {
        List<PhieuGiamGia> vouchers = voucherRepository.findAll();
//        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
        LocalDateTime currentDateTime = LocalDateTime.now();
//        OffsetDateTime currentDateTime = OffsetDateTime.now(ZoneOffset.UTC);
        for (PhieuGiamGia voucher : vouchers) {
            System.out.println("Current DateTime: " + currentDateTime);

            LocalDateTime startDateTime = voucher.getNgayBatDau();
            LocalDateTime endDateTime = voucher.getNgayKetThuc();
            if (voucher.getSoLuong() == null || voucher.getSoLuong() == 0) {
                voucher.setTrangThai("Đã kết thúc");
            } else {
                if (currentDateTime.isBefore(startDateTime)) {
                    voucher.setTrangThai("Sắp diễn ra");
                } else if (currentDateTime.isAfter(startDateTime) && currentDateTime.isBefore(endDateTime)) {
                    voucher.setTrangThai("Đang diễn ra");
                } else {
                    voucher.setTrangThai("Đã kết thúc");
                }
                if (endDateTime.isEqual(startDateTime)) {
                    voucher.setTrangThai("Đã kết thúc");
                }
            }

            voucherRepository.save(voucher);
        }
    }


    @Override
    public PhieuGiamGia updateEndDate(Integer id) {
        PhieuGiamGia voucherToUpdate = voucherRepository.findById(id).orElse(null);
        if (voucherToUpdate == null) {
            throw new RestApiException("Phiếu giảm giá không tồn tại.");
        }

        LocalDateTime currentDateTime = LocalDateTime.now();

        if (voucherToUpdate.getTrangThai().equals("Đã kết thúc")) {
            throw new RestApiException("Phiếu giảm giá này đã kết thúc rồi!");
        }

        if (voucherToUpdate.getTrangThai().equals("Sắp diễn ra")) {
            LocalDateTime startDate = LocalDateTime.now().with(LocalTime.MIN);
            voucherToUpdate.setNgayBatDau(startDate);
        }

        voucherToUpdate.setNgayKetThuc(currentDateTime);
        voucherToUpdate.setTrangThai("Đã kết thúc"); // Đã kết thúc
        return voucherRepository.save(voucherToUpdate);
    }

    @Override
    public PageableObject<KhachHangResponse> findKhachHang(KhachHangRequest request) {
        return new PageableObject<>(accountRepository.getAllKhachHang(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }

    @Override
    public PageableObject<KhachHangResponse> findKhachHangIdPGG(Integer id, KhachHangRequest request) {
        return new PageableObject<>(accountRepository.getAllKhachHangID(id, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }


    public void updateStatus(PhieuGiamGia voucher) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        System.out.println("Current DateTime: " + currentDateTime);

        LocalDateTime startDateTime = voucher.getNgayBatDau();
        LocalDateTime endDateTime = voucher.getNgayKetThuc();

        if (currentDateTime.isBefore(startDateTime)) {
            voucher.setTrangThai("Sắp diễn ra"); // Chưa bắt đầu
        } else if (currentDateTime.isAfter(startDateTime) && currentDateTime.isBefore(endDateTime)) {
            voucher.setTrangThai("Đang diễn ra"); // Đang diễn ra
        } else {
            voucher.setTrangThai("Đã kết thúc"); // Đã kết thúc
        }

        voucherRepository.save(voucher);
    }


}
