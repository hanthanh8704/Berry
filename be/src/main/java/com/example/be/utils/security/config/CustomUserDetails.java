package com.example.be.utils.security.config;

import com.example.be.entities.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final Account account;

    public CustomUserDetails(Account account) {
        this.account = account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(account.getRole().getName())); // Trả về vai trò của tài khoản
    }

    @Override
    public String getPassword() {
        return account.getPassword(); // Trả về mật khẩu đã mã hóa
    }

    @Override
    public String getUsername() {
        return account.getEmail(); // Sử dụng email để đăng nhập
    }

    // Thêm phương thức để lấy tên nhân viên
    public String getEmployeeName() {
        return account.getEmployee() != null ? account.getEmployee().getName() : null; // Lấy employeeName từ đối tượng Employee
    }

    // Các phương thức khác
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
