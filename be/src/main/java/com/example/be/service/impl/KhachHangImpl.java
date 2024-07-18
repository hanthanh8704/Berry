package com.example.be.service.impl;


import com.example.be.dto.request.khachHang.DiaChiRequest;
import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.Account;
import com.example.be.entity.ChucVu;
import com.example.be.entity.DiaChi;
import com.example.be.entity.KhachHang;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.DiaChiRepository;
import com.example.be.repository.KhachHangRepository;
import com.example.be.repository.ChucVuRepository;
import com.example.be.service.KhachHangService;

import com.example.be.util.CloudinaryUtils;
import com.example.be.util.MailUtils;
import com.example.be.util.common.GenCode;
import com.example.be.util.common.PageableObject;
import com.example.be.util.constant.ChucVuEnum;
import com.example.be.util.converter.DiaChiConvert;
import com.example.be.util.converter.KhachHangConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KhachHangImpl implements KhachHangService {

    private final KhachHangRepository accountRepository;
    private final DiaChiRepository diaChiRepository;
    private final AccountRepository taiKhoanRepository;
    private final KhachHangConvert accountConvert;
    private final DiaChiConvert addressConvert;
    private final CloudinaryUtils cloudinaryUtils;
    private final ChucVuRepository chucVuRepository;
    private final MailUtils mailUtils;

    @Autowired
    public KhachHangImpl(KhachHangRepository accountRepository, DiaChiRepository diaChiRepository, AccountRepository taiKhoanRepository, KhachHangConvert accountConvert, DiaChiConvert addressConvert, CloudinaryUtils cloudinaryUtils, ChucVuRepository chucVuRepository, MailUtils mailUtils) {
        this.accountRepository = accountRepository;
        this.diaChiRepository = diaChiRepository;
        this.taiKhoanRepository = taiKhoanRepository;
        this.accountConvert = accountConvert;
        this.addressConvert = addressConvert;
        this.cloudinaryUtils = cloudinaryUtils;
        this.chucVuRepository = chucVuRepository;
        this.mailUtils = mailUtils;
    }

    private String genCode() {
        String prefix = "KH0";
        int x = 1;
        String code = prefix + x;
        while (accountRepository.existsByMa(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public PageableObject<KhachHangResponse> getAll(KhachHangRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(accountRepository.getAll(request, pageable));
    }

    @Override
    public KhachHang getOne(Integer id) {
        return accountRepository.getOne(id);
    }

    @Override
    public KhachHang getOneKhachHang(Integer id) {
        return accountRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public KhachHang create(KhachHangRequest request) {
        // Check validate
        // Tạo mật khẩu ngẫu nhiên
        String randomPassword = GenCode.randomPassword();

        // Chuyển đổi request thành đối tượng KhachHang
        KhachHang khachHang = accountConvert.convertRequestToEntity(request);
        khachHang.setMa(genCode()); // Set mã khách hàng
        khachHang.setTrangThai("Đang hoạt động");
        khachHang.setDeleted(false); // Không bị xóa

        // Lưu thông tin KhachHang vào cơ sở dữ liệu
        KhachHang savedKhachHang = accountRepository.save(khachHang);

        // Tải lên ảnh nếu có
        if (request.getAnh() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getAnh(), "khachhang");
            if (uploadedImageUrl != null) {
                savedKhachHang.setAnh(uploadedImageUrl);
                accountRepository.save(savedKhachHang);
            } else {
                System.out.println("Tải lên ảnh thất bại.");
            }
        } else {
            System.out.println("Không có ảnh trong request.");
        }

        // Tạo tài khoản cho khách hàng vừa thêm
        Account account = new Account();
        account.setEmail(savedKhachHang.getEmail());
        account.setPassword(randomPassword);
        ChucVu chucVu = chucVuRepository.findByVaiTro(ChucVuEnum.CUSTOMER.name());
        account.setChucVu(chucVu);
        Account savedAccount = taiKhoanRepository.save(account);
        savedKhachHang.setAccount(savedAccount);
        accountRepository.save(savedKhachHang);

        // Xử lý địa chỉ nếu có
        if (request.getDiaChiRequest() != null) {
            DiaChi diaChi = new DiaChi();
            diaChi.setDiaChiMacDinh(true);
            diaChi.setIdKhachHang(savedKhachHang);
            diaChi.setSoDienThoai(savedKhachHang.getSoDienThoai());
            diaChi.setHoTen(savedKhachHang.getHoTen());
            diaChi.setThanhPho(request.getDiaChiRequest().getThanhPho());
            diaChi.setPhuong(request.getDiaChiRequest().getPhuong());
            diaChi.setHuyen(request.getDiaChiRequest().getHuyen());
            diaChi.setDiaChiCuThe(request.getDiaChiRequest().getDiaChiCuThe());
            diaChi.setNguoiTao("Admin");
            diaChiRepository.save(diaChi);
        } else {
            System.out.println("DiaChiRequest is null");
        }

        // Gửi email thông báo cho khách hàng về tài khoản đã tạo
        String emailContent = "Kính gửi " + savedKhachHang.getHoTen() + ",\n\n" +
                "Chúng tôi xin trân trọng thông báo rằng bạn đã đăng ký tài khoản thành công tại hệ thống Beery Store.\n\n" +
                "Thông tin tài khoản của bạn như sau:\n" +
                "Username: " + savedAccount.getEmail() + "\n" +
                "Password: " + savedAccount.getPassword() + "\n\n" +
                "Vui lòng đăng nhập và hoàn tất các bước xác thực để kích hoạt tài khoản của bạn.\n\n" +
                "Trân trọng,\n" +
                "Beery Store";
        mailUtils.sendEmail(savedKhachHang.getEmail(), "Thư Xác Thực Tài Khoản", emailContent);

        // Trả về đối tượng KhachHang đã lưu
        return savedKhachHang;
    }


    @Override
    @Transactional
    public KhachHang update(Integer id, KhachHangRequest request) {
        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
        KhachHang khachHang = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));

        // Cập nhật thông tin KhachHang từ request
        khachHang.setHoTen(request.getHoTen());
        khachHang.setTrangThai(request.getTrangThai());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgaySinh(request.getNgaySinh());
        khachHang.setSoDienThoai(request.getSoDienThoai());
        khachHang.setEmail(request.getEmail());
        khachHang.setDeleted(request.getDeleted());

        // Tải lên ảnh mới nếu có
        if (request.getAnh() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getAnh(), "khachhang");
            khachHang.setAnh(uploadedImageUrl);
        }

        // Lưu thông tin KhachHang đã cập nhật vào cơ sở dữ liệu
        KhachHang updatedKhachHang = accountRepository.save(khachHang);

        // Lấy danh sách địa chỉ của khách hàng
        List<DiaChi> diaChiList = diaChiRepository.findByIdKhachHang(id);

        // Cập nhật thông tin địa chỉ nếu có DiaChiRequest
        DiaChiRequest diaChiRequest = request.getDiaChiRequest();
        if (diaChiRequest != null) {
            DiaChi diaChi = diaChiList.get(0); // Assuming you want to update the first address found
            diaChi.setIdKhachHang(updatedKhachHang); // Sử dụng updatedKhachHang ở đây
            diaChi.setHoTen(updatedKhachHang.getHoTen());
            diaChi.setSoDienThoai(updatedKhachHang.getSoDienThoai());
            diaChi.setThanhPho(diaChiRequest.getThanhPho());
            diaChi.setPhuong(diaChiRequest.getPhuong());
            diaChi.setHuyen(diaChiRequest.getHuyen());
            diaChi.setDiaChiCuThe(diaChiRequest.getDiaChiCuThe());
            diaChi.setNguoiTao("Admin"); // Cập nhật thông tin người tạo nếu cần
            diaChiRepository.save(diaChi);
        } else if (diaChiRequest == null) {
            // In ra thông báo DiaChiRequest là null
            System.out.println("DiaChiRequest is null");
        } else {
            // Xử lý trường hợp không tìm thấy địa chỉ
            throw new RuntimeException("Không tìm thấy địa chỉ với id khách hàng: " + updatedKhachHang.getId());
        }

        return updatedKhachHang;
    }

}
