package com.example.be.service.impl;

import com.example.be.dto.request.KhachHang.KhachHangRequest;
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
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.converter.PhieuGiamGiaConvert;
import com.example.be.utils.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Pageable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class PhieuGiamGiaImpl implements PhieuGiamGiaService {
    @Autowired
    private PhieuGiamGiaRepository voucherRepository;
    @Autowired
    private KhachHangRepository accountRepository;
    @Autowired
    private PhieuGiamGiaKhachHangRepository accountVoucherRepository;
//    @Autowired
//    private INotificationRepository notificationRepository;
    @Autowired
    private PhieuGiamGiaConvert voucherConvert;

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

    @Override
    public PhieuGiamGiaResponse edit(Integer id) {
        PhieuGiamGiaResponse pgg = voucherRepository.getOneVoucher(id);
        return pgg;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public PhieuGiamGia add(PhieuGiamGiaRequest request) {
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getSoLuong() <= 0) {
            throw new RestApiException("Số lượng phải lớn hơn 0.");
        }
        if (request.getSoLuong() <= 0 || request.getSoLuong() != (int) request.getSoLuong() || request.getSoLuong() == null) {
            throw new RestApiException("Số lượng phải là số nguyên dương.");
        }
        if(request.getSoLuong()>10000){
            throw new RestApiException("Số lượng không được vượt quá 10000. ");
        }
        if(request.getKieuGiam().equals("%")) {
            try {
                double percentReduce = Double.valueOf(request.getGiaTriGiam().toString());
                if (percentReduce < 0 || percentReduce > 50) {
                    throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
            } catch (RestApiException e) {
                throw e;
            }
        }else{
            try {
                double percentReduce = Double.valueOf(request.getGiaTriGiam().toString());
                if (percentReduce < 0 || percentReduce >2000000000) {
                    throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 2000000000. ");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 2000000000. ");
            } catch (RestApiException e) {
                throw e;
            }
        }

        if (Double.valueOf(request.getGiaTriGiam().toString()) <= 0) {
            throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
        }
        if (request.getGiaTriToiDa().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getNgayBatDau().after(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getNgayBatDau().before(Timestamp.valueOf(LocalDateTime.now(ZoneOffset.UTC)))) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }
        if (request.getNgayBatDau().equals(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        request.setMa(genCode());
        PhieuGiamGia voucher = voucherConvert.converRequestToEntity(request);
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

                });
            }
        }
        return voucher;

    }

    @Override
    public PhieuGiamGia update(Integer id, PhieuGiamGiaRequest request) {
        PhieuGiamGia voucherToUpdate = voucherRepository.findById(id).orElse(null);
        if (request.getTen().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getSoLuong() <= 0) {
            throw new RestApiException("Số lượng phải lớn hơn 0. ");
        }
        if(request.getSoLuong()>10000){
            throw new RestApiException("Số lượng không được vượt quá 10000. ");
        }
        if (request.getSoLuong() <= 0 || request.getSoLuong() != (int) request.getSoLuong() || request.getSoLuong() == null) {
            throw new RestApiException("Số lượng phải là số nguyên dương.");
        }
        if(request.getKieuGiam().equals("%")) {
            try {
                double percentReduce = Double.valueOf(request.getGiaTriGiam().toString());
                if (percentReduce < 0 || percentReduce > 50) {
                    throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
            } catch (RestApiException e) {
                throw e;
            }
        }else{
            try {
                double percentReduce = Double.valueOf(request.getGiaTriGiam().toString());
                if (percentReduce < 0 || percentReduce >2000000000) {
                    throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 2000000000. ");
                }
            } catch (NumberFormatException e) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 2000000000. ");
            } catch (RestApiException e) {
                throw e;
            }
        }
        if (!String.valueOf(request.getGiaTriGiam()).matches("^-?\\d+(\\.\\d+)?$")) {
//            System.out.println("1212");
            throw new RestApiException("Giá trị giảm phải là số");
        }
        if (request.getGiaTriToiDa().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getNgayBatDau().after(request.getNgayKetThuc())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
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
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<PhieuGiamGia> vouchers = voucherRepository.findAll();
        for (PhieuGiamGia voucher : vouchers) {
            LocalDateTime startDate = voucher.getNgayBatDau().toLocalDateTime();
            LocalDateTime endDate = voucher.getNgayKetThuc().toLocalDateTime();
            // so luong bang 0 thi se ket thuc voucher som
            if (voucher.getSoLuong() == 0) {
                voucher.setTrangThai("Đã kết thúc"); // Đã kết thúc
//                voucher.setEndDate(currentDateTime);
            } else {
                if (voucher.getSoLuong() > 0) {
                    voucher.setTrangThai("Đang diễn ra"); // Đang diễn ra
                }
                if (currentDateTime.isBefore(startDate)) {
                    voucher.setTrangThai("Sắp diễn ra"); // Chưa bắt đầu
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    voucher.setTrangThai("Đang diễn ra"); // Đang diễn ra
                } else {
                    voucher.setTrangThai("Đã kết thúc"); // Đã kết thúc
//                voucher.setDeleted(true);
                }


                if (endDate.isEqual(startDate)) {
                    voucher.setTrangThai("Đã kết thúc"); // Đã kết thúc
//                voucher.setDeleted(true);
                }
            }
            voucherRepository.save(voucher);
        }
    }

    @Override
    public PhieuGiamGia updateEndDate(Integer id) {
        PhieuGiamGia voucherToUpdate = voucherRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        Date date = new Date();
        if(voucherToUpdate.getTrangThai().equals("Đã kết thúc")) {
            throw new RestApiException("Phiếu giảm giá này đã kết thúc rồi!");
        }
        if(voucherToUpdate.getTrangThai().equals("Sắp diễn ra")){
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            voucherToUpdate.setNgayBatDau(Timestamp.valueOf(startDate));
        }
        voucherToUpdate.setNgayKetThuc(Timestamp.valueOf(currentDate));
        voucherToUpdate.setTrangThai("Đã kết thúc"); // Đã kết thúc
        return voucherRepository.save(voucherToUpdate);

    }

    @Override
    public PageableObject<KhachHangResponse> findKhachHang(KhachHangRequest request) {
        return new PageableObject<>(accountRepository.getAllKhachHang(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }



    public void updateStatus(PhieuGiamGia voucher) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = voucher.getNgayBatDau().toLocalDateTime();
        LocalDateTime endDate = voucher.getNgayKetThuc().toLocalDateTime();
        if (currentDate.isBefore(startDate)) {
            voucher.setTrangThai("Sắp diễn ra"); // Chưa bắt đầu
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            voucher.setTrangThai("Đang diễn ra"); // Đang diễn ra
//            voucher.setDeleted(null);
        } else {
            voucher.setTrangThai("Đã kết thúc"); // Đã kết thúc
//            voucher.setDeleted(true);
        }
        voucherRepository.save(voucher);
    }

    public void createScheduledVoucher() {
        // Lấy ngày hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now();
        // set name voucher theo ngày tạo
        String voucherName = "Phiếu giảm giá ngày " + currentDateTime.format(DateTimeFormatter.ofPattern("dd/MM"));
        // Đặt startDate vào 00:00:00 của ngày hiện tại
        LocalDateTime startDate = currentDateTime.with(LocalTime.MIN);
        // Đặt endDate vào 23:59:59 của ngày hiện tại
        LocalDateTime endDate = currentDateTime.with(LocalTime.MAX);

        // logic
        PhieuGiamGia voucher = new PhieuGiamGia();
        voucher.setMa(genCode());
        voucher.setTen(voucherName);
        voucher.setNgayBatDau(Timestamp.valueOf(startDate));
        voucher.setNgayKetThuc(Timestamp.valueOf(endDate));
        voucher.setGiaTriToiDa(BigDecimal.valueOf(10000));
        voucher.setGiaTriGiam(BigDecimal.valueOf(5));
        voucher.setSoLuong(100);
        updateStatus(voucher);
    }

    private boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}