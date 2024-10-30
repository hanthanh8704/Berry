package com.example.be.services;

import com.example.be.entities.Account;
import com.example.be.entities.Customer;
import com.example.be.entities.Role;
import com.example.be.repositories.admin.AccountRepository;
import com.example.be.repositories.admin.CustomerRepository;
import com.example.be.repositories.admin.RoleRepository;

import com.example.be.utils.security.auth.AuthClientRequest;
import com.example.be.utils.security.auth.AuthRequest;
import com.example.be.utils.security.token.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ClientAuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomerrService customerService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public Account register(AuthClientRequest authClientRequest) throws RoleNotFoundException {
        // Kiểm tra nếu email đã tồn tại
        if (accountRepository.findByEmail(authClientRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Kiểm tra nếu tên khách hàng đã tồn tại
        if (customerRepository.findByFullName(authClientRequest.getCustomerName()).isPresent()) {
            throw new RuntimeException("Tên khách hàng đã tồn tại");
        }

        // Kiểm tra nếu số điện thoại đã tồn tại
        if (customerRepository.findByPhoneNumber(authClientRequest.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        // Tạo tài khoản mới
        Account account = new Account();
        account.setEmail(authClientRequest.getEmail());
        account.setPassword(passwordEncoder.encode(authClientRequest.getPassword()));

        // Gán role mặc định là "Customer"
        Role defaultRole = roleRepository.findById(3)
                .orElseThrow(() -> new RoleNotFoundException("Chức vụ mặc định không tồn tại"));
        account.setRole(defaultRole);

        // Tạo Customer mới
        Customer customer = new Customer();
        customer.setFullName(authClientRequest.getCustomerName());
        customer.setPhoneNumber(authClientRequest.getPhoneNumber());
        customer.setEmail(authClientRequest.getEmail());
        customer.setStatus("Active");

        // Sinh mã khách hàng tự động
        customer.setCode(customerService.generateCustomerCode());

        // Liên kết customer với tài khoản
        customer.setAccount(account);
        account.setCustomer(customer);

        return accountRepository.save(account);
    }


    // Đăng nhập client và trả về JWT token cùng các thông tin
    public Map<String, Object> login(AuthClientRequest loginRequest) {
        // Tìm tài khoản theo email
        Account account = accountRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này"));

        // Xác thực tài khoản
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(account.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Sinh JWT token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);

        // Xây dựng phản hồi
        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", account.getEmail());
        response.put("role", account.getRole().getName());
        response.put("password", account.getPassword());
        // Thêm thông tin khách hàng nếu có
        Customer customer = account.getCustomer();
        if (customer != null) {
            response.put("customerId", customer.getId());
            response.put("customerName", customer.getFullName());
            response.put("customerEmail", customer.getEmail());
            response.put("customerPhoneNumber", customer.getPhoneNumber());
        }

        return response;
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        // Tìm tài khoản dựa vào email
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        // Kiểm tra mật khẩu cũ có khớp không
        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        // Mã hóa mật khẩu mới và cập nhật
        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

    // Đăng xuất, xoá ngữ cảnh bảo mật
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}
