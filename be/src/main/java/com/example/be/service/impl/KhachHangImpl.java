//package com.example.be.service.impl;
//
//import com.example.be.dto.request.khachhang.KhachhangRequest;
//import com.example.be.entity.DiaChi;
//import com.example.be.entity.KhachHang;
//import com.example.be.repository.KhachHangRepository;
//import com.example.be.service.KhachHangService;
//import com.example.be.util.CloudinaryUtils;
//import com.example.be.util.common.GenCode;
//import com.example.be.util.common.PageableObject;
//import com.example.be.util.converter.DiaChiConvert;
//import com.example.be.util.converter.KhachHangConvert;
//import com.example.be.util.exception.RestApiException;
//import jakarta.transaction.Transactional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//
//@Service
//public class KhachHangImpl implements KhachHangService   {
//     @Autowired
//    private KhachHangRepository accountRepository;
////    @Autowired
////    private IRoleRepository roleRepository;
//    @Autowired
//    private DiaChiRepository addressRepository;
//    @Autowired
//    private KhachHangConvert accountConvert;
//    @Autowired
//    private DiaChiConvert addressConvert;
////    @Autowired
////    private MailUtils mailUtils;
//    @Autowired
//    private CloudinaryUtils cloudinaryUtils;
//
//    @Override
//    public PageableObject<KhachhHangResponse> getAll(KhachhangRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage()-1, request.getSizePage());
//        return new PageableObject<>(accountRepository.getAll(request, pageable));
//    }
//
//    @Override
//    public KhachHang getOne(Integer id) {
//        return accountRepository.getOne(id);
//    }
//
//    @Override
//    @Transactional
//    public KhachHang create(KhachhangRequest request) {
//        if (accountRepository.existsByTaiKhoanAndTaiKhoanNot(request.getTaiKhoan(), ""))
//            throw new RestApiException("Username đã tồn tại!");
//        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), ""))
//            throw new RestApiException("Email đã tồn tại!");
//        if (accountRepository.existsBySoDienThoaiAndSoDienThoai(request.getSoDienThoai(), ""))
//            throw new RestApiException("SDT đã tồn tại!");
////        if (accountRepository.existsByCccdAndCccdNot(request.getcc(), ""))
////            throw new RestApiException("Mã định danh đã tồn tại!");
//
//        String randomPassword = GenCode.randomPassword();
//        KhachHang account = accountConvert.convertRequestToEntity(request);
////        account.setRole(roleRepository.findByName(roleName));
////        account.setAccountRoles(roleName.equals("Khách hàng") ? AccountRoles.ROLE_USER : AccountRoles.ROLE_EMLOYEE);
//        account.setMatKhau(randomPassword);
//        account.setAnh("defaultAvatar.jpg");
//        KhachHang accountSave = accountRepository.save(account);
//        if (accountSave != null) {
//            DiaChi address = addressConvert.convertRequestToEntity(request.getAddress());
//            address.setKhachHang(accountSave);
//            addressRepository.save(address);
////            Upload Images
//            if (request.getAnh() != null)
//                accountSave.setAnh(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAnh(), "account")));
////            Send Mail
////            String emailContent = "Chào " + accountSave.getEmail() + "\n" + "Bạn vừa dùng email này để đăng ký tài khoản cho hệ thống Bee Shoes Store\n" + "Tài khoản của bạn là: " + accountSave.getUsername() + "\n" + "Mật khẩu đăng nhập là: " + accountSave.getPassword() + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n" + "Trang chủ BeeShoes: https://beeshoes.vunguyenhuong.id.vn\n" + "Liên hệ: https://facebook.com/VuNguyenHuong.Official";
////            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
//        }
//        return accountSave;
//    }
//
//    @Override
//    public KhachHang update(Integer id, KhachhangRequest request) {
//        KhachHang old = accountRepository.findById(id).get();
//        if (accountRepository.existsByTaiKhoanAndTaiKhoanNot(request.getTaiKhoan(), old.getTaiKhoan()))
//            throw new RestApiException("Username đã tồn tại!");
//        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), old.getEmail()))
//            throw new RestApiException("Email đã tồn tại!");
//        if (accountRepository.existsBySoDienThoaiAndSoDienThoai(request.getSoDienThoai(), old.getSoDienThoai()))
//            throw new RestApiException("SDT đã tồn tại!");
////        if (accountRepository.existsByCccdAndCccdNot(request.getCccd(), old.getCccd()))
////            throw new RestApiException("Mã định danh đã tồn tại!");
//        KhachHang accountSave = accountRepository.save(accountConvert.convertRequestToEntity(id, request));
//        if (accountSave != null) {
//            if (request.getAnh() != null) {
//                accountSave.setAnh(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAnh(), "account")));
//                accountRepository.save(accountSave);
//            }
//        }
//        return accountSave;
//    }
//
//    @Override
//    public KhachHang delete(Integer id) {
//        return null;
//    }
//}
