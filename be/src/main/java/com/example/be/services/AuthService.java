package com.example.be.services;

import com.example.be.entities.Account;
import com.example.be.entities.*;
import com.example.be.entities.Employee;
import com.example.be.repositories.admin.AccountRepository;
import com.example.be.repositories.admin.EmployeeRepository;
import com.example.be.repositories.admin.RoleRepository;
import com.example.be.utils.security.auth.AuthRequest;
import com.example.be.utils.security.token.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmployeService employeService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public Account register(AuthRequest accountDTO) throws RoleNotFoundException {
        // Kiểm tra nếu email đã tồn tại
        if (accountRepository.findByEmail(accountDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Tạo tài khoản mới
        Account account = new Account();
        account.setEmail(accountDTO.getEmail());
        account.setPassword(passwordEncoder.encode(accountDTO.getPassword()));



        Role defaultRole = roleRepository.findById(1)
                .orElseThrow(() -> new RoleNotFoundException("Chức vụ mặc định không tồn tại"));
        account.setRole(defaultRole);

        // Tạo nhân viên mới
        Employee employee = new Employee();
        employee.setName(accountDTO.getEmployeeName());

        employee.setEmail(accountDTO.getEmail());
        employee.setStatus("active");

        // Sinh mã nhân viên tự động
        employee.setCode(employeService.generateEmployeeCode());

        employee.setAccount(account);
        account.setEmployee(employee);

        return accountRepository.save(account);
    }


    // Đăng nhập với thông tin tài khoản, trả về thông tin nhân viên và role
    public Map<String, Object> login(AuthRequest loginRequest) {
        try {

            Account account = accountRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

            // Kiểm tra mật khẩu
            if (!passwordEncoder.matches(loginRequest.getPassword(), account.getPassword())) {
                throw new RuntimeException("Email hoặc mật khẩu không đúng");
            }

            // Xác thực
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
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

            // Thêm thông tin nhân viên nếu có
            Employee employee = account.getEmployee(); // Lấy thông tin nhân viên từ tài khoản
            if (employee != null) {
                response.put("employeeId", employee.getId());
                response.put("employeeName", employee.getName());
                response.put("employeeEmail", employee.getEmail());

                response.put("employeeCode", employee.getCode());
            } else {
                response.put("employee", "Không có thông tin nhân viên.");
            }

            response.put("message", "Đăng nhập thành công");
            return response;

        } catch (AuthenticationException e) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng");
        } catch (Exception e) {
            throw new RuntimeException("Kiểm tra lại thông tin!");
        }
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

    // Lấy thông tin người dùng hiện tại
    public Map<String, Object> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }

        String userEmail;
        if (authentication.getPrincipal() instanceof UserDetails) {
            userEmail = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else {
            userEmail = authentication.getName();
        }

        Account account = accountRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", account.getId());
        userInfo.put("email", account.getEmail());

        userInfo.put("role", account.getRole().getName());

        if (account.getEmployee() != null) {
            userInfo.put("employeeId", account.getEmployee().getId());
            userInfo.put("employeeName", account.getEmployee().getName());
            userInfo.put("employeeCode", account.getEmployee().getCode());
        }

        return userInfo;
    }

    // Chuyển đổi từ Account entity sang AuthRequest DTO
    private AuthRequest convertToDTO(Account account) {
        AuthRequest dto = new AuthRequest();
        dto.setId(account.getId());
        dto.setEmail(account.getEmail());



        if (account.getEmployee() != null) {
            dto.setEmployeeId(account.getEmployee().getId()); // Lấy ID của nhân viên
        }
        return dto;
    }


}
