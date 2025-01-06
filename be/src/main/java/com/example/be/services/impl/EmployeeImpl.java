package com.example.be.services.impl;


import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Account;
import com.example.be.entities.Employee;
import com.example.be.entities.Role;
import com.example.be.repositories.admin.AccountRepository;
import com.example.be.repositories.admin.EmployeeRepository;
import com.example.be.repositories.admin.RoleRepository;
import com.example.be.services.EmployeeService;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import com.example.be.utils.MailUtils;
import com.example.be.utils.common.GenCodee;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.ChucVuEnum;

import com.example.be.utils.converter.client.EmployeeConverter;
import com.example.be.utils.security.auth.AuthRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployeeImpl implements EmployeeService {
    private final EmployeeConverter employeeConverter;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final CloudinaryUtil cloudinaryUtil;
    private final MailUtils mailUtils;
    private final EmployeeRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    public EmployeeImpl(
            EmployeeConverter employeeConverter,
            RoleRepository roleRepository,
            AccountRepository accountRepository,
            CloudinaryUtil cloudinaryUtil,
            MailUtils mailUtils,
            EmployeeRepository employeeRepository) {
        this.employeeConverter = employeeConverter;
        this.roleRepository = roleRepository;
        this.accountRepository = accountRepository;
        this.cloudinaryUtil = cloudinaryUtil;
        this.mailUtils = mailUtils;
        this.employeeRepository = employeeRepository;
    }
    private String genCode() {
        String prefix = "E00";
        int x = 1;
        String code = prefix + x;
        while (employeeRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }
    @Override
    public PageableObject<EmployeeResponse> getAll(EmployeeRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(employeeRepository.getAll(request, pageable));
    }

    @Override
    public Employee createEmployee(EmployeeRequest request, String vaiTro, HttpServletRequest httpRequest, AuthRequest registerRequest) {

        String employeeName = (String) httpRequest.getAttribute("employeeName");

//        if (employeeName == null) {
//            throw new RuntimeException("Không tìm thấy tên nhân viên trong request.");
//        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.");
        }

        if (employeeRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống. Vui lòng sử dụng số điện thoại khác.");
        }

        if (employeeRepository.existsByNationalId(request.getNationalId())) {
            throw new RuntimeException("Số CCCD/CMND đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.");
        }

        String randomPassword = GenCodee.randomPassword();

        Employee nhanVien = employeeConverter.convertRequestToEntity(request);

        nhanVien.setStatus("Đang hoạt động");

        // Upload ảnh nếu có
        if (request.getImage() != null) {
            String uploadedImageUrl = cloudinaryUtil.uploadSingleImage(request.getImage(), "nhanvien");
            if (uploadedImageUrl != null) {
                nhanVien.setImage(uploadedImageUrl);
            } else {
                System.out.println("Tải lên ảnh thất bại.");
            }
        } else {
            System.out.println("Không có ảnh trong request.");
        }

        nhanVien.setCode(genCode());
        nhanVien.setDeleted(false);
        nhanVien.setCreatedBy(employeeName);
        nhanVien.setUpdatedBy(employeeName);
        Employee savedNhanVien = employeeRepository.save(nhanVien);
        Account account = new Account();
        account.setEmail(savedNhanVien.getEmail());
        account.setPassword(passwordEncoder.encode(randomPassword)); // Mã hóa mật khẩu random
        Role chucVu = roleRepository.findByName(ChucVuEnum.EMPLOYEE.name());
        account.setRole(chucVu);
        account.setCreatedBy(employeeName);
        account.setUpdatedBy(employeeName);
        Account savedAccount = accountRepository.save(account);

        savedNhanVien.setAccount(savedAccount);
        employeeRepository.save(savedNhanVien);

        String emailContent = "Kính gửi " + savedNhanVien.getName() + ",\n\n" +
                "Chúng tôi xin trân trọng thông báo rằng bạn đã đăng ký tài khoản thành công tại hệ thống của chúng tôi.\n\n" +
                "Thông tin tài khoản của bạn như sau:\n" +
                "Username: " + savedAccount.getEmail() + "\n" +
                "Password: " + randomPassword + "\n\n" +
                "Vui lòng đăng nhập và hoàn tất các bước xác thực để kích hoạt tài khoản của bạn.\n\n" +
                "Trân trọng,\n" +
                "Berry Store";
        mailUtils.sendEmail(savedNhanVien.getEmail(), "Thư Xác Thực Tài Khoản", emailContent);

        return savedNhanVien;
    }






    @Override
    public EmployeeResponse getOne(Integer id) {
        return employeeRepository.getOneEmpolyee(id);
    }

    @Override
    public Employee getEmployeeById(Integer idNV) {
        return employeeRepository.findById(idNV)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + idNV));
    }



    @Override
    public Employee update(Integer id, EmployeeRequest employeeRequest) {
        // Kiểm tra email trùng lặp (ngoại trừ nhân viên hiện tại)
        if (employeeRepository.existsByEmailAndIdNot(employeeRequest.getEmail(), id)) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.");
        }

        // Kiểm tra số điện thoại trùng lặp (ngoại trừ nhân viên hiện tại)
        if (employeeRepository.existsByPhoneNumberAndIdNot(employeeRequest.getPhoneNumber(), id)) {
            throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống. Vui lòng sử dụng số điện thoại khác.");
        }

        // Kiểm tra số CCCD/CMND trùng lặp (ngoại trừ nhân viên hiện tại)
        if (employeeRepository.existsByNationalIdAndIdNot(employeeRequest.getNationalId(), id)) {
            throw new RuntimeException("Số CCCD/CMND đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.");
        }

        // Kiểm tra employee có tồn tại
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));

        // Lưu URL ảnh cũ để đề phòng
        String oldImageUrl = existingEmployee.getImage();

        // Sử dụng converter để cập nhật thông tin cơ bản
        Employee updatedEmployee = employeeConverter.convertRequestToEntity(id, employeeRequest);

        // Xử lý ảnh
        if (employeeRequest.getImage() != null && !employeeRequest.getImage().isEmpty()) {
            try {
                String uploadedImageUrl = cloudinaryUtil.uploadSingleImage(employeeRequest.getImage(), "nhanvien");
                if (uploadedImageUrl != null && !uploadedImageUrl.isEmpty()) {
                    updatedEmployee.setImage(uploadedImageUrl);
                } else {
                    // Nếu upload thất bại, giữ lại ảnh cũ
                    updatedEmployee.setImage(oldImageUrl);
                    System.out.println("Tải lên ảnh thất bại, giữ lại ảnh cũ");
                }
            } catch (Exception e) {
                // Xử lý lỗi upload ảnh
                updatedEmployee.setImage(oldImageUrl);
                System.err.println("Lỗi khi upload ảnh: " + e.getMessage());
            }
        } else {
            // Không có ảnh mới, giữ lại ảnh cũ
            updatedEmployee.setImage(oldImageUrl);
        }

        // Đảm bảo các thông tin quan trọng không bị mất
        updatedEmployee.setAccount(existingEmployee.getAccount());

        // Lưu vào database
        return employeeRepository.save(updatedEmployee);
    }

}

