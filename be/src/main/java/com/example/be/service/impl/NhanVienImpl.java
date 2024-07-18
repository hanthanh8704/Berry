package com.example.be.service.impl;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.Account;
import com.example.be.entity.ChucVu;
import com.example.be.entity.NhanVien;
import com.example.be.repository.AccountRepository;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.NhanVienRepository;
import com.example.be.service.NhanVienService;
import com.example.be.util.CloudinaryUtils;
import com.example.be.util.MailUtils;
import com.example.be.util.common.GenCode;
import com.example.be.util.common.PageableObject;
import com.example.be.util.constant.ChucVuEnum;
import com.example.be.util.converter.NhanVienConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class NhanVienImpl implements NhanVienService {

    private final NhanVienConvert nhanVienConvert;

    private final ChucVuRepository chucVuRepository;

    private final AccountRepository accountRepository;

    private final CloudinaryUtils cloudinaryUtils;
    private final MailUtils mailUtils;
    private final NhanVienRepository nhanVienRepository;

    @Autowired
    public NhanVienImpl(NhanVienConvert nhanVienConvert, ChucVuRepository chucVuRepository, AccountRepository accountRepository, CloudinaryUtils cloudinaryUtils, MailUtils mailUtils, NhanVienRepository nhanVienRepository) {
        this.nhanVienConvert = nhanVienConvert;
        this.chucVuRepository = chucVuRepository;
        this.accountRepository = accountRepository;
        this.cloudinaryUtils = cloudinaryUtils;
        this.mailUtils = mailUtils;
        this.nhanVienRepository = nhanVienRepository;
    }

    @Override
    public PageableObject<NhanVienResponse> getAll(NhanVienRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(nhanVienRepository.getAll(request, pageable));
    }

    @Override
    @Transactional
    public NhanVien createNhanVien(NhanVienRequest request, String vaiTro) {
        String randomPassword = GenCode.randomPassword();

        // Convert request thành entity NhanVien
        NhanVien nhanVien = nhanVienConvert.convertRequestToEntity(request);

        // Set vai tro và trạng thái mặc định
        nhanVien.setChucVu(chucVuRepository.findByVaiTro(ChucVuEnum.EMPLOYEE.name()));
        nhanVien.setTrangThai("Đang hoạt động");

        // Upload ảnh nếu có
        if (request.getAnh() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getAnh(), "nhanvien");
            if (uploadedImageUrl != null) {
                nhanVien.setAnh(uploadedImageUrl);
            } else {
                System.out.println("Tải lên ảnh thất bại.");
            }
        } else {
            System.out.println("Không có ảnh trong request.");
        }

        // Lưu nhân viên vào cơ sở dữ liệu
        nhanVien.setDeleted(false);
        NhanVien savedNhanVien = nhanVienRepository.save(nhanVien);

        // Tạo và lưu tài khoản mới
        Account account = new Account();
        account.setEmail(savedNhanVien.getEmail());
        account.setPassword(randomPassword);
        ChucVu chucVu = chucVuRepository.findByVaiTro(ChucVuEnum.EMPLOYEE.name());
        account.setChucVu(chucVu);
        Account savedAccount = accountRepository.save(account);

        // Liên kết tài khoản với nhân viên và lưu lại thông tin nhân viên
        savedNhanVien.setAccount(savedAccount);
        nhanVienRepository.save(savedNhanVien);

        // Gửi email thông báo cho khách hàng về tài khoản đã tạo
        String emailContent = "Kính gửi " + savedNhanVien.getTen() + ",\n\n" +
                "Chúng tôi xin trân trọng thông báo rằng bạn đã đăng ký tài khoản thành công tại hệ thống của chúng tôi.\n\n" +
                "Thông tin tài khoản của bạn như sau:\n" +
                "Username: " + savedAccount.getEmail() + "\n" +
                "Password: " + savedAccount.getPassword() + "\n\n" +
                "Vui lòng đăng nhập và hoàn tất các bước xác thực để kích hoạt tài khoản của bạn.\n\n" +
                "Trân trọng,\n" +
                "Berry Store";
        mailUtils.sendEmail(savedNhanVien.getEmail(), "Thư Xác Thực Tài Khoản", emailContent);
        return savedNhanVien;
    }

    @Override
    public NhanVienResponse getOne(Integer id) {
        return nhanVienRepository.getOneNhanVien(id);
    }


    @Override
    public NhanVien getNhanVienById(Integer idNV) {
        return null;
    }

    @Override
    public NhanVien update(Integer id, NhanVienRequest nhanVienRequest) {

        // Lấy thông tin nhân viên từ cơ sở dữ liệu dựa trên id
        NhanVien nhanVien = nhanVienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));

        NhanVien nhanVienSave = nhanVienConvert.convertRequestToEntity(id, nhanVienRequest);
        if (nhanVienRequest.getAnh() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(nhanVienRequest.getAnh(), "nhanvien");
            if (uploadedImageUrl != null) {
                nhanVienSave.setAnh(uploadedImageUrl);
            } else {
                System.out.println("Tải lên ảnh thất bại.");
            }
        } else {
            System.out.println("Không có ảnh trong request.");
        }

        return nhanVienRepository.save(nhanVienSave);
    }

}
