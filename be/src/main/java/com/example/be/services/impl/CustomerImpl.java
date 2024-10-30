package com.example.be.services.impl;


import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.entities.Account;
import com.example.be.entities.Address;
import com.example.be.entities.Customer;
import com.example.be.entities.Role;
import com.example.be.repositories.admin.AccountRepository;
import com.example.be.repositories.admin.AddressRepository;
import com.example.be.repositories.admin.CustomerRepository;
import com.example.be.repositories.admin.RoleRepository;
import com.example.be.services.CustomerService;
import com.example.be.utils.MailUtils;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import com.example.be.utils.common.GenCodee;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.ChucVuEnum;
import com.example.be.utils.converter.AddressConvert;
import com.example.be.utils.converter.CustomerConvert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final AccountRepository accountRepository;
    private final CustomerConvert customerConvert;
    private final AddressConvert addressConvert;
    private final CloudinaryUtil cloudinaryUtils;
    private final RoleRepository roleRepository;
    private final MailUtils mailUtils;

    @Autowired
    public CustomerImpl(CustomerRepository customerRepository, AddressRepository addressRepository, AccountRepository accountRepository, CustomerConvert customerConvert, AddressConvert addressConvert, CloudinaryUtil cloudinaryUtils, RoleRepository roleRepository, MailUtils mailUtils) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.accountRepository = accountRepository;
        this.customerConvert = customerConvert;
        this.addressConvert = addressConvert;
        this.cloudinaryUtils = cloudinaryUtils;
        this.roleRepository = roleRepository;
        this.mailUtils = mailUtils;
    }

    private String genCode() {
        String prefix = "KH0";
        int x = 1;
        String code = prefix + x;
        while (customerRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public PageableObject<CustomerResponse> getAll(CustomerRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(customerRepository.getAll(request, pageable));
    }


    @Override
    public Customer getOne(Integer id) {
        return customerRepository.getOne(id);
    }


    @Override
    public Customer getOneCustomer(Integer id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Customer create(CustomerRequest request) {
        // Check validate
        // Tạo mật khẩu ngẫu nhiên
        String randomPassword = GenCodee.randomPassword();

        // Chuyển đổi request thành đối tượng Customer
        Customer customer = (Customer) customerConvert.convertRequestToEntity(request);
        System.out.println("Khách hàng 92:"+customer);
        customer.setCode(genCode()); // Set mã khách hàng
        customer.setStatus("Đang hoạt động");
        customer.setDeleted(false); // Không bị xóa

        // Lưu thông tin Customer vào cơ sở dữ liệu
        Customer savedCustomer = customerRepository.save(customer);

        // Tải lên ảnh nếu có
        if (request.getImage() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
            if (uploadedImageUrl != null) {
                savedCustomer.setImage(uploadedImageUrl);
                customerRepository.save(savedCustomer); // Lưu lại sau khi cập nhật ảnh
            } else {
                System.out.println("Tải lên ảnh thất bại.");
            }
        } else {
            System.out.println("Không có ảnh trong request.");
        }

        // Tạo tài khoản cho khách hàng vừa thêm
        Account account = new Account();
        account.setEmail(savedCustomer.getEmail());
        account.setPassword(randomPassword);
        Role role = roleRepository.findByName(ChucVuEnum.CUSTOMER.name());
        account.setRole(role);
        Account savedAccount = accountRepository.save(account);
        savedCustomer.setAccount(savedAccount);
        customerRepository.save(savedCustomer); // Lưu lại sau khi cập nhật tài khoản

        // Xử lý địa chỉ nếu có
        if (request.getAddressRepuest() != null) {
            Address address = new Address();
            address.setDefaultAddress(true);
            System.out.println("Dòng 127:");
            address.setCustomer(savedCustomer);

            address.setPhoneNumber(savedCustomer.getPhoneNumber());
            System.out.println("Dòng 132 : " + savedCustomer.getPhoneNumber());
            address.setFullName(savedCustomer.getFullName());
            System.out.println("Dòng sốddt : " + savedCustomer.getFullName());
            address.setCity(request.getAddressRepuest().getCity());
            System.out.println("Dòng thành phố : " + request.getAddressRepuest().getCity());
            address.setWard(request.getAddressRepuest().getWard());
            System.out.println("Dòng huyen phuong : " + request.getAddressRepuest().getWard());
            address.setDistrict(request.getAddressRepuest().getDistrict());
            System.out.println("Dòng tỉnh : " + request.getAddressRepuest().getDistrict());
            address.setDetailedAddress(request.getAddressRepuest().getDetailedAddress());
            System.out.println("Dòng dong chi tiet : " + request.getAddressRepuest().getDetailedAddress());
            address.setDefaultAddress(request.getAddressRepuest().getDefaultAddress());
            address.setCreatedBy("Admin");
            addressRepository.save(address);
        } else {
            System.out.println("DiaChiRequest is null");
        }

        // Gửi email thông báo cho khách hàng về tài khoản đã tạo
        String emailContent = "Kính gửi " + savedCustomer.getFullName() + ",\n\n" +
                "Chúng tôi xin trân trọng thông báo rằng bạn đã đăng ký tài khoản thành công tại hệ thống Beery Store.\n\n" +
                "Thông tin tài khoản của bạn như sau:\n" +
                "Username: " + savedAccount.getEmail() + "\n" +
                "Password: " + randomPassword + "\n\n" + // Sử dụng mật khẩu đã tạo
                "Vui lòng đăng nhập và hoàn tất các bước xác thực để kích hoạt tài khoản của bạn.\n\n" +
                "Trân trọng,\n" +
                "Beery Store";
        mailUtils.sendEmail(savedCustomer.getEmail(), "Thư Xác Thực Tài Khoản", emailContent);

        // Trả về đối tượng Customer đã lưu
        return savedCustomer;
    }


    @Override
    @Transactional
    public Customer update(Integer id, CustomerRequest request) {
        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));

        // Cập nhật thông tin KhachHang từ request
        customer.setFullName(request.getFullName());
        System.out.println("khachHang : " + request.getFullName());
        customer.setStatus(request.getStatus());
        System.out.println("trangThai : " + request.getStatus());
        customer.setGender(request.getGender());
        System.out.println("gioiTinh : " + request.getGender());
        customer.setDateOfBirth(request.getDateOfBirth());
        System.out.println("ngaySinh : " + request.getDateOfBirth());
        customer.setPhoneNumber(request.getPhoneNumber());
        System.out.println("soDienThoai : " + request.getPhoneNumber());
        customer.setEmail(request.getEmail());
        System.out.println("email : " + request.getEmail());
        customer.setDeleted(request.getDeleted());

        // Tải lên ảnh mới nếu có
        if (request.getImage() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
            customer.setImage(uploadedImageUrl);
        }

        // Lưu thông tin KhachHang đã cập nhật vào cơ sở dữ liệu
        Customer updatedCustomer = customerRepository.save(customer);
        System.out.println("Khách hàng sau khi update : 195" + updatedCustomer);
        // Lấy danh sách địa chỉ của khách hàng
        List<Address> diaChiList = addressRepository.findByIdCustomer(id);

        // Cập nhật thông tin địa chỉ nếu có DiaChiRequest
        AddressRequest addressRepuest = request.getAddressRepuest();
        if (addressRepuest != null) {
            Address address = diaChiList.get(0);

            address.setCustomer(updatedCustomer);
            System.out.println("khách hang: " + updatedCustomer);
            address.setFullName(updatedCustomer.getFullName());
            System.out.println("Họ tên khác :" + updatedCustomer.getFullName());
            address.setPhoneNumber(updatedCustomer.getPhoneNumber());
            System.out.println("Số điện thoại :" + updatedCustomer.getPhoneNumber());
            address.setCity(addressRepuest.getCity());
            System.out.println("Thành phố :" + addressRepuest.getCity());
            address.setWard(addressRepuest.getWard());
            System.out.println("Phường Thị Xã :" + addressRepuest.getWard());
            address.setDistrict(addressRepuest.getDistrict());
            System.out.println("Quận/Huyện :" + addressRepuest.getDistrict());
            address.setDefaultAddress(false);
            address.setCreatedBy("Admin"); // Cập nhật thông tin người tạo nếu cần
            addressRepository.save(address);
        } else if (addressRepuest == null) {
            // In ra thông báo DiaChiRequest là null
            System.out.println("addressRepuest is null");
        } else {
            // Xử lý trường hợp không tìm thấy địa chỉ
            throw new RuntimeException("Không tìm thấy địa chỉ với id khách hàng: " + updatedCustomer.getId());
        }

        return updatedCustomer;
    }

}
