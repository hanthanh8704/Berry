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
import com.example.be.services.AuthService;
import com.example.be.services.CustomerService;
import com.example.be.utils.MailUtils;
import com.example.be.utils.cloudinary.CloudinaryUtil;
import com.example.be.utils.common.GenCodee;
import com.example.be.utils.common.PageableObject;
import com.example.be.utils.constant.ChucVuEnum;
import com.example.be.utils.converter.AddressConvert;
import com.example.be.utils.converter.CustomerConvert;
import com.example.be.utils.security.auth.AuthRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

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
        String prefix = "C00";
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
    public Customer create(CustomerRequest request, HttpServletRequest httpRequest, AuthRequest registerRequest) {
        // Lấy employeeName từ request attribute (được set trong JwtTokenFilter)
        String employeeName = (String) httpRequest.getAttribute("employeeName");

        // Kiểm tra nếu không có employeeName, có thể throw exception hoặc xử lý theo cách bạn muốn
        if (employeeName == null) {
            throw new RuntimeException("Không tìm thấy tên nhân viên trong request.");
        }


        // Kiểm tra trùng lặp email
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng.");
        }

        // Kiểm tra trùng lặp số điện thoại
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại này đã được sử dụng.");
        }

        // Kiểm tra thông tin và tạo mật khẩu ngẫu nhiên
        String randomPassword = GenCodee.randomPassword();

        // Chuyển đổi request thành đối tượng Customer
        Customer customer = customerConvert.convertRequestToEntity(request);
        customer.setCode(genCode()); // Set mã khách hàng
        customer.setStatus("Đang hoạt động");
        customer.setDeleted(false); // Không bị xóa
        customer.setCreatedBy(employeeName);
        customer.setUpdatedBy(employeeName);
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
        }

        // Tạo tài khoản cho khách hàng vừa thêm
        Account account = new Account();
        account.setEmail(savedCustomer.getEmail());
        account.setPassword(passwordEncoder.encode(randomPassword)); // Mã hóa mật khẩu random
        Role role = roleRepository.findByName(ChucVuEnum.CUSTOMER.name());
        account.setRole(role);
        account.setCreatedBy(employeeName);
        account.setUpdatedBy(employeeName);
        Account savedAccount = accountRepository.save(account);
        savedCustomer.setAccount(savedAccount);
        customerRepository.save(savedCustomer);
        // Xử lý địa chỉ nếu có
        if (request.getAddressRequest() != null) {
            Address address = new Address();
            address.setDefaultAddress(false);
            System.out.println("Khách hàng : ");
            address.setPhoneNumber(savedCustomer.getPhoneNumber());
            address.setFullName(savedCustomer.getFullName());
            address.setCity(request.getAddressRequest().getCity());
            address.setWard(request.getAddressRequest().getWard());
            address.setDistrict(request.getAddressRequest().getDistrict());
            address.setDetailedAddress(request.getAddressRequest().getDetailedAddress());
            address.setDefaultAddress(request.getAddressRequest().getDefaultAddress());
            address.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            address.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            address.setCreatedBy(employeeName);
            address.setDeleted(false);
            address.setCreatedBy(employeeName);
            address.setCustomer(savedCustomer);
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


//    @Override
//    @Transactional
//    public Customer update(Integer id, CustomerRequest request, HttpServletRequest httpRequest) {
//        String employeeName = (String) httpRequest.getAttribute("employeeName");
//
//        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
//        Customer customer = customerRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));
//
//        // Cập nhật thông tin KhachHang từ request
//        customer.setFullName(request.getFullName());
//        customer.setStatus(request.getStatus());
//        customer.setGender(request.getGender());
//        customer.setDateOfBirth(request.getDateOfBirth());
//        customer.setPhoneNumber(request.getPhoneNumber());
//        customer.setEmail(request.getEmail());
//        customer.setDeleted(request.getDeleted());
//
//
//        // Tải lên ảnh mới nếu có
//        if (request.getImage() != null) {
//            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
//            customer.setImage(uploadedImageUrl);
//        }
//
//        // Lưu thông tin KhachHang đã cập nhật vào cơ sở dữ liệu
//        Customer updatedCustomer = customerRepository.save(customer);
//
//        // Lấy danh sách địa chỉ của khách hàng
//        List<Address> diaChiList = addressRepository.findByIdCustomer(id);
//        System.out.println("Danh sách dia chi : "+ diaChiList);
//
//        // Cập nhật thông tin địa chỉ nếu có DiaChiRequest
//        AddressRequest addressRepuest = request.getAddressRepuest();
//        System.out.println("Địa chỉ request : " + addressRepuest);
//        if (addressRepuest != null) {
//            Address address = diaChiList.get(0);
//            address.setCustomer(updatedCustomer);
//            address.setFullName(updatedCustomer.getFullName());
//            address.setPhoneNumber(updatedCustomer.getPhoneNumber());
//            address.setCity(addressRepuest.getCity());
//            address.setWard(addressRepuest.getWard());
//            address.setDistrict(addressRepuest.getDistrict());
//            address.setDefaultAddress(false);
//            address.setDeleted(false);
//            address.setUpdatedBy(employeeName);
//            address.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
//            addressRepository.save(address);
//        } else {
//            System.out.println("DiaChiRequest is null");
//        }
//
//
//        return updatedCustomer;
//    }
//


//    @Override
//    @Transactional
//    public Customer update(Integer id, CustomerRequest request, HttpServletRequest httpRequest) {
//        String employeeName = (String) httpRequest.getAttribute("employeeName");
//
//        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
//        Customer customer = customerRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));
//
//        // Cập nhật thông tin KhachHang từ request
//        customer.setFullName(request.getFullName());
//        customer.setStatus(request.getStatus());
//        customer.setGender(request.getGender());
//        customer.setDateOfBirth(request.getDateOfBirth());
//        customer.setPhoneNumber(request.getPhoneNumber());
//        customer.setEmail(request.getEmail());
//        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
//        customer.setUpdatedBy(employeeName);
//        customer.setDeleted(false);
//
//        // Tải lên ảnh mới nếu có
//        if (request.getImage() != null) {
//            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
//            customer.setImage(uploadedImageUrl);
//        }
//
//        // Lấy danh sách địa chỉ của khách hàng
//        List<Address> diaChiList = addressRepository.findByIdCustomer(id);
//        System.out.println("Danh sách địa chỉ: " + diaChiList.get(0));
//        AddressRequest addressRequest = request.getAddressRequest();
//        System.out.println("Địa chỉ request: " + addressRequest);
//        // Lưu thông tin KhachHang đã cập nhật vào cơ sở dữ liệu
//        Customer updatedCustomer = customerRepository.save(customer);
//        // Kiểm tra và cập nhật địa chỉ
//        if (addressRequest != null) {
//            Address address = diaChiList.get(0);
//            address.setCustomer(updatedCustomer);
//            address.setFullName(updatedCustomer.getFullName());
//            address.setPhoneNumber(updatedCustomer.getPhoneNumber());
//            address.setCity(addressRequest.getCity());
//            address.setWard(addressRequest.getWard());
//            address.setDistrict(addressRequest.getDistrict());
//            address.setDefaultAddress(addressRequest.getDefaultAddress());
//            address.setDeleted(false);
//            address.setUpdatedBy(employeeName);
//            address.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
//            addressRepository.save(address);
//        } else {
//            System.out.println("DiaChiRequest is null. Giữ nguyên địa chỉ cũ.");
//        }
//        return updatedCustomer;
//    }

    @Override
    @Transactional
    public Customer update(Integer id, CustomerRequest request, HttpServletRequest httpRequest) {
        String employeeName = (String) httpRequest.getAttribute("employeeName");
        // Kiểm tra email trùng lặp (ngoại trừ khách hàng hiện tại)
        if (customerRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.");
        }

        // Kiểm tra số điện thoại trùng lặp (ngoại trừ khách hàng hiện tại)
        if (customerRepository.existsByPhoneNumberAndIdNot(request.getPhoneNumber(), id)) {
            throw new RuntimeException("Số điện thoại đã tồn tại trong hệ thống. Vui lòng sử dụng số điện thoại khác.");
        }

        // Lấy thông tin KhachHang từ cơ sở dữ liệu dựa trên id
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + id));

        // Cập nhật thông tin KhachHang từ request
        customer.setFullName(request.getFullName());
        customer.setStatus(request.getStatus());
        customer.setGender(request.getGender());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setPhoneNumber(request.getPhoneNumber());
        customer.setEmail(request.getEmail());
        customer.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        customer.setUpdatedBy(employeeName);
        customer.setDeleted(false);

        // Tải lên ảnh mới nếu có
        if (request.getImage() != null) {
            String uploadedImageUrl = cloudinaryUtils.uploadSingleImage(request.getImage(), "khachhang");
            customer.setImage(uploadedImageUrl);
        }

        // Lấy danh sách địa chỉ của khách hàng
        List<Address> diaChiList = addressRepository.findByIdCustomer(id);
        AddressRequest addressRequest = request.getAddressRequest();

        // Lưu thông tin KhachHang đã cập nhật vào cơ sở dữ liệu
        Customer updatedCustomer = customerRepository.save(customer);

        // Kiểm tra và cập nhật địa chỉ
        if (addressRequest != null) {
            Address address = diaChiList.get(0);
            address.setCustomer(updatedCustomer);
            address.setFullName(updatedCustomer.getFullName());
            address.setPhoneNumber(updatedCustomer.getPhoneNumber());
            address.setCity(addressRequest.getCity());
            address.setWard(addressRequest.getWard());
            address.setDistrict(addressRequest.getDistrict());
            address.setDefaultAddress(addressRequest.getDefaultAddress());
            address.setDeleted(false);
            address.setUpdatedBy(employeeName);
            address.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            addressRepository.save(address);
        } else {
            System.out.println("DiaChiRequest is null. Giữ nguyên địa chỉ cũ.");
        }

        return updatedCustomer;
    }


}
