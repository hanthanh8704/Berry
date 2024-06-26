package com.example.TuHocFullStack.controller;

import com.example.TuHocFullStack.dto.NhanVienDto;
import com.example.TuHocFullStack.service.NhanVienService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@CrossOrigin("*") //CORS là một cơ chế bảo mật mà trình duyệt sử dụng để kiểm soát các yêu cầu được thực hiện
// từ một tên miền khác với tên miền mà trang đang được phục vụ.
// Điều này ngăn chặn các trang web độc hại thực hiện các yêu cầu không mong muốn trên trang web của bạn.
@RestController
@RequestMapping("/api/nhan-vien")
public class NhanVienController {
//    @Autowired
//    private NhanVienService nhanVienService;
//
//
//    // Ham them Nhan vien vao REST API
//    @PostMapping("/create")
//    public ResponseEntity<NhanVienDto> createNhanVien(@RequestBody NhanVienDto nhanVienDto) {
//        NhanVienDto savedNhanVien = nhanVienService.createNhanVien(nhanVienDto);
//        return new ResponseEntity<>(savedNhanVien, HttpStatus.CREATED);
//    }
//
//    // Ham lay danh sach tat ca Nhan vien
//    @GetMapping("/index")
//    public ResponseEntity<List<NhanVienDto>> getAllNhanViens() {
//        List<NhanVienDto> nhanVienList = nhanVienService.getAllNhanVien();
//        return ResponseEntity.ok(nhanVienList);
//    }
//
//    //Lấy ra nhan vien theo id REST API
//    @GetMapping("/detail/{id}")
//    public ResponseEntity<NhanVienDto> detail(@PathVariable("id") Integer id) {
//        NhanVienDto nhanVienDto = nhanVienService.getNhanVienById(id);
//        return ResponseEntity.ok(nhanVienDto);
//    }
//
//    //Hamf update theo id REST API
//    @PutMapping("/update/{id}")
//    public ResponseEntity<NhanVienDto> updateNhanVien(@PathVariable("id") Integer id, @RequestBody NhanVienDto updateNhanVien) {
//        NhanVienDto nhanVienDto = nhanVienService.update(id, updateNhanVien);
//        return ResponseEntity.ok(nhanVienDto);
//    }
//
//    //Xoa thoe id
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<String> delete(@PathVariable("id") Integer idNV) {
//        nhanVienService.delete(idNV);
//        return ResponseEntity.ok("Xóa thành công nhân viên");
//    }


}
