package com.example.be.service.impl;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.NhanVienRepository;
import com.example.be.service.NhanVienService;
import com.example.be.util.CloudinaryUtils;
import com.example.be.util.MailUtils;
import com.example.be.util.common.GenCode;
import com.example.be.util.common.PageableObject;
import com.example.be.util.converter.NhanVienConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class NhanVienImpl implements NhanVienService {

    @Autowired
    private NhanVienConvert nhanVienConvert;
    @Autowired
    private ChucVuRepository chucVuRepository;
    @Autowired
    private CloudinaryUtils cloudinaryUtils;
    @Autowired
    private MailUtils mailUtils;
    private final NhanVienRepository nhanVienRepository;

    @Autowired
    public NhanVienImpl(NhanVienRepository nhanVienRepository) {
        this.nhanVienRepository = nhanVienRepository;
    }

    @Override
    public PageableObject<NhanVienResponse> getAll(NhanVienRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(nhanVienRepository.getAll(request, pageable));
    }


    @Override
    public NhanVien createNhanVien(NhanVienRequest nhanVienRequest, String vaiTro) {
        String randomPassword = GenCode.randomPassword();
        String randomTaiKhoan = GenCode.randomTaiKhoan();
        NhanVien account = nhanVienConvert.convertRequestToEntity(nhanVienRequest);
        account.setChucVu(chucVuRepository.findByVaiTro(vaiTro));
        account.setMatKhau(randomPassword);
        account.setTaiKhoan(randomTaiKhoan);
//        account.setAnh("defaultAvatar.jpg");
        NhanVien accountSave = nhanVienRepository.save(account);
        if (accountSave != null) {
//            if (nhanVienRequest.getAnh() != null)
//                accountSave.setAnh(String.valueOf(cloudinaryUtils.uploadSingleImage(nhanVienRequest.getAnh(), "nhanvien")));
            String emailContent = "Chào " + accountSave.getEmail() + "\n" + "Bạn vừa dùng email này để đăng ký tài khoản cho hệ thống Berry Store\n" + "Tài khoản của bạn là: " + accountSave.getTaiKhoan() + "\n" + "Mật khẩu đăng nhập là: " + accountSave.getMatKhau() + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n" + "Liên hệ: https://facebook.com/HaiDang.Official";
            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
        }
        return accountSave;
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

        if (nhanVienRequest.getMa() == null || nhanVienRequest.getMa().isEmpty()) {
            throw new IllegalArgumentException("Mã nhân viên không được để trống");
        }
        if (nhanVienRequest.getTen() == null || nhanVienRequest.getTen().isEmpty()) {
            throw new IllegalArgumentException("Tên không được để trống");
        }
        if (nhanVienRequest.getDiaChi() == null || nhanVienRequest.getDiaChi().isEmpty()) {
            throw new IllegalArgumentException("Địa chỉ không được để trống");
        }
        if (nhanVienRequest.getNgaySinh() == null) {
            throw new IllegalArgumentException("Ngày sinh không được để trống");
        }
        if (nhanVienRequest.getSoDienThoai() == null || nhanVienRequest.getSoDienThoai().isEmpty() || !nhanVienRequest.getSoDienThoai().matches("\\d{10,11}")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
        }
        if (nhanVienRequest.getGioiTinh() == null || nhanVienRequest.getGioiTinh().isEmpty()) {
            throw new IllegalArgumentException("Giới tính không được để trống");
        }
        if (nhanVienRequest.getEmail() == null || nhanVienRequest.getEmail().isEmpty() || !nhanVienRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }
        if (nhanVienRequest.getCccd() == null || nhanVienRequest.getCccd().isEmpty() || !nhanVienRequest.getCccd().matches("\\d{9,12}")) {
            throw new IllegalArgumentException("CCCD không hợp lệ");
        }
        if (nhanVienRequest.getTrangThai() == null || nhanVienRequest.getTrangThai().isEmpty()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        NhanVien nhanVienSave = nhanVienRepository.save(nhanVienConvert.convertRequestToEntity(id, nhanVienRequest));

        return nhanVienSave;
    }


}
