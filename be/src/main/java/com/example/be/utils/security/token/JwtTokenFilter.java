package com.example.be.utils.security.token;

import com.example.be.utils.security.config.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtTokenFilter(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService) {
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Lấy JWT từ request
        String token = getJwtFromRequest(request);

        if (token != null && jwtUtil.extractUsername(token) != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Lấy email từ token
            String email = jwtUtil.extractUsername(token);

            // Lấy thông tin người dùng từ cơ sở dữ liệu
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

            // Lấy các thông tin từ token
            String employeeName = jwtUtil.extractEmployeeName(token);
            String customerName = jwtUtil.extractCustomerName(token);
            Integer employeeId = jwtUtil.extractEmployeeId(token);  // Lấy employeeId từ token

            // Kiểm tra tính hợp lệ của token
            if (jwtUtil.validateToken(token, userDetails)) {
                // Tạo đối tượng Authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Lưu vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Lưu thông tin vào request attributes để có thể sử dụng trong các lớp khác
                request.setAttribute("employeeName", employeeName);
                request.setAttribute("customerName", customerName);
                request.setAttribute("employeeId", employeeId);  // Lưu employeeId vào request attribute
            }
        }

        filterChain.doFilter(request, response);
    }


    // Lấy JWT từ request header
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Bỏ 'Bearer ' để lấy JWT
        }
        return null;
    }
}
