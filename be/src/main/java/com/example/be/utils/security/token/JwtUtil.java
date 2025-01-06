package com.example.be.utils.security.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    private String SECRET_KEY = "6DYeQBaM7cg4bkEY34dwCxvhqEHDrcIkB/1pBhRHET/TOjm4qSYQ5geijjM2/iNUcnDjJAbrTVBC6e1bvlq+YA==";
    private final long JWT_EXPIRATION = 1000 * 60 * 60 * 10;
    // Phương thức trích xuất username từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    // Phương thức trích xuất thời gian hết hạn của token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Phương thức trích xuất một claim cụ thể từ token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Phương thức trích xuất tất cả các claims từ token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // Phương thức kiểm tra token đã hết hạn hay chưa
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Phương thức trích xuất danh sách vai trò từ token
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }
    public Integer extractRoleId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roleId", Integer.class);
    }

    public Integer extractEmployeeId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("employeeId", Integer.class); // Giả sử 'employeeId' là key trong token
    }


    public String extractRoleName(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roleName", String.class);
    }

    public String extractEmployeeName(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("employeeName", String.class);
    }
    public String extractCustomerName(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("customerName", String.class);
    }


    // Phương thức tạo token mới với thông tin người dùng
    public String generateTokenCustomer(UserDetails userDetails, Integer roleId, String roleName,String customerName) {
        Map<String, Object> claims = new HashMap<>();

        // Thêm vai trò vào claims
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        claims.put("roles", authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        // Thêm roleId và roleName vào claims
        claims.put("roleId", roleId);
        claims.put("roleName", roleName);
        // Thêm employeeName vào claims
        claims.put("customerName", customerName);
        return createToken(claims, userDetails.getUsername());
    }


    public String generateToken(UserDetails userDetails, Integer roleId, String roleName, String employeeName, Integer employeeId) {
        Map<String, Object> claims = new HashMap<>();

        // Thêm vai trò vào claims
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        claims.put("roles", authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        // Thêm thông tin khác vào claims
        claims.put("roleId", roleId);
        claims.put("roleName", roleName);
        claims.put("employeeName", employeeName);
        claims.put("employeeId", employeeId);  // Thêm employeeId vào claims

        return createToken(claims, userDetails.getUsername());
    }





    // Phương thức tạo token với claims và subject (username)
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION * 1000))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


    // Phương thức xác thực token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
