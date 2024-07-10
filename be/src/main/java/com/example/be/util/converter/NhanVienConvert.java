package com.example.be.util.converter;

import com.example.be.dto.request.nhanVien.NhanVienRequest;

import com.example.be.entity.NhanVien;
import com.example.be.repository.ChucVuRepository;
import com.example.be.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class NhanVienConvert {
    @Autowired
    private NhanVienRepository accountRepository;

    @Autowired
    private ChucVuRepository roleRepository;

//    public NhanVien convertRequestToEntity(NhanVienRequest request) {
//        return NhanVien.builder()
//                .ma(request.getMa())
//                .ten(request.getTen())
//                .diaChi(request.getDiaChi())
//                .ngaySinh(request.getNgaySinh())
//                .soDienThoai(request.getSoDienThoai())
//                .gioiTinh(request.getGioiTinh())
//                .cccd(request.getCccd())
//                .taiKhoan(request.getTaiKhoan())
//                .matKhau(request.getMatKhau())
//                .email(request.getEmail())
////                .anh(request.getAnh().toString())
//                .trangThai(request.getTrangThai())
//                .chucVu(request.getIdChucVu() != null ? roleRepository.findById(request.getIdChucVu()).orElse(null) : null)
//                .build();
//    }

    public NhanVien convertRequestToEntity(NhanVienRequest request) {
        validateRequest(request);
        // Sinh mã nhân viên từ tên
        String generatedMa = generateEmployeeCode(request.getTen());

        // Đảm bảo tính duy nhất của mã
        String uniqueMa = generateEmployeeCode(generatedMa);

        return NhanVien.builder()
                .ma(uniqueMa)
                .ten(request.getTen())
                .diaChi(request.getDiaChi())
                .ngaySinh(request.getNgaySinh())
                .soDienThoai(request.getSoDienThoai())
                .gioiTinh(request.getGioiTinh())
                .cccd(request.getCccd())
//                .taiKhoan(request.getTaiKhoan())
                .email(request.getEmail())
                .trangThai(request.getTrangThai())
                .chucVu(request.getIdChucVu() != null ? roleRepository.findById(request.getIdChucVu()).orElse(null) : null)
                .build();
    }


    private void validateRequest(NhanVienRequest request) {
        if (request.getTen() == null || request.getTen().isEmpty()) {
            throw new IllegalArgumentException("Tên nhân viên không được để trống.");
        }
        if (request.getCccd() == null || !Pattern.matches("^[0-9]{9,12}$", request.getCccd())) {
            throw new IllegalArgumentException("CCCD không hợp lệ. CCCD phải có từ 9 đến 12 chữ số.");
        }
        if (request.getSoDienThoai() == null || !Pattern.matches("^[0-9]{10}$", request.getSoDienThoai())) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ. Số điện thoại phải gồm 10 chữ số.");
        }

        if (accountRepository.existsBySoDienThoai(request.getSoDienThoai())) {
            throw new IllegalArgumentException("Số điện thoại đã được sử dụng.");
        }

        // Kiểm tra trùng lặp email
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }
        if (request.getEmail() == null || !Pattern.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", request.getEmail())) {
            throw new IllegalArgumentException("Email không hợp lệ.");
        }

        if (request.getDiaChi() == null || request.getDiaChi().isEmpty()) {
            throw new IllegalArgumentException("Địa chỉ không được để trống.");
        }
        if (request.getNgaySinh() == null) {
            throw new IllegalArgumentException("Ngày sinh không được để trống.");
        }
        if (request.getGioiTinh() == null || (!request.getGioiTinh().equals("Nam") && !request.getGioiTinh().equals("Nữ"))) {
            throw new IllegalArgumentException("Giới tính không hợp lệ. Giới tính phải là 'Nam' hoặc 'Nữ'.");
        }
        if (request.getTrangThai() == null || (!request.getTrangThai().equals("Hoạt động") && !request.getTrangThai().equals("Ngừng hoạt động"))) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ. Trạng thái phải là 'Hoạt động' hoặc 'Ngừng hoạt động'.");
        }
    }


    private String generateEmployeeCode(String ten) {
        // Sinh mã từ tên nhân viên, ví dụ: Đỗ Hải Đăng => dangdh1
        String[] parts = ten.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();

        // Lấy tên (từ cuối cùng trong parts)
        if (parts.length > 0) {
            String lastName = parts[parts.length - 1];
            sb.append(lastName.substring(0, Math.min(lastName.length(), 9)).toLowerCase());
        }

        // Lấy họ và tên đệm (các từ đầu tiên trong parts)
        for (int i = 0; i < parts.length - 1; i++) {
            String part = parts[i];
            sb.append(part.substring(0, Math.min(part.length(), 1)).toLowerCase());
        }

        // Thêm số thứ tự để đảm bảo tính duy nhất của mã
        sb.append(getUniqueSuffix(sb.toString()));

        return sb.toString();
    }

    private String getUniqueSuffix(String base) {
        // Tạo số thứ tự để đảm bảo tính duy nhất của mã
        String candidateCode = base;
        int suffix = 1;
        while (employeeCodeExists(candidateCode)) {
            candidateCode = base + suffix;
            suffix++;
        }
        return String.valueOf(suffix);
    }

    private boolean employeeCodeExists(String ma) {
        // TODO: Cần cập nhật logic kiểm tra xem mã nhân viên đã tồn tại trong hệ thống chưa
        // Ví dụ:
        // return nhanVienRepository.existsByMa(ma);
        return false; // Giả sử là chưa viết logic kiểm tra, bạn cần cập nhật theo hệ thống của bạn
    }

    public NhanVien convertRequestToEntity(Integer id, NhanVienRequest request) {
        NhanVien account = accountRepository.findById(id).get();
//        account.setMatKhau(request.getMatKhau() == null ? account.getMatKhau() : request.getMatKhau());
        account.setNgaySinh(request.getNgaySinh());
        account.setMa(request.getMa());
        account.setEmail(request.getEmail());
        account.setTen(request.getTen());
        account.setCccd(request.getCccd());
//        account.setTaiKhoan(request.getTaiKhoan());
        account.setSoDienThoai(request.getSoDienThoai());
        account.setGioiTinh(request.getGioiTinh());
//        account.setAnh(request.getAnh().toString());
        account.setTrangThai(request.getTrangThai());
        return account;
    }
}
