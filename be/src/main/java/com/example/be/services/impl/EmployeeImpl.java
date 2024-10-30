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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Override
    public PageableObject<EmployeeResponse> getAll(EmployeeRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(employeeRepository.getAll(request, pageable));
    }

    @Override
    public Employee createEmployee(EmployeeRequest request, String vaiTro) {
        String randomPassword = GenCodee.randomPassword();

        // Convert request thành entity NhanVien
        Employee nhanVien = employeeConverter.convertRequestToEntity(request);

        // Set vai trò và trạng thái mặc định
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

        // Lưu nhân viên vào cơ sở dữ liệu
        nhanVien.setDeleted(false);
        Employee savedNhanVien = employeeRepository.save(nhanVien);

        // Tạo và lưu tài khoản mới
        Account account = new Account();
        account.setEmail(savedNhanVien.getEmail());
        account.setPassword(randomPassword);
        Role chucVu = roleRepository.findByName(ChucVuEnum.EMPLOYEE.name());
        account.setRole(chucVu);
        Account savedAccount = accountRepository.save(account);

        // Liên kết tài khoản với nhân viên và lưu lại thông tin nhân viên
        savedNhanVien.setAccount(savedAccount);
        employeeRepository.save(savedNhanVien);

        // Gửi email thông báo cho khách hàng về tài khoản đã tạo
        String emailContent = "Kính gửi " + savedNhanVien.getName() + ",\n\n" +
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
        try {
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
//            updatedEmployee.setDeleted(existingEmployee.isDeleted());

            // Lưu vào database
            return employeeRepository.save(updatedEmployee);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật nhân viên: " + e.getMessage());
        }
    }

}

