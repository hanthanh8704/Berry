package com.example.be.controller;

import com.example.be.dto.request.nhanVien.NhanVienDto;
import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import com.example.be.service.NhanVienService;
import com.example.be.util.common.PageableObject;
import com.example.be.util.common.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/nhan-vien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    private static String vaiTro ="Nhân viên";
    @GetMapping
    public PageableObject<NhanVienResponse> getAll(NhanVienRequest request) {
        return nhanVienService.getAll(request);
    }

    // Ham them Nhan vien vao REST API
    @PostMapping("/create")
    public ResponseObject createNhanVien(@RequestBody NhanVienRequest nhanvienRequest) {
        NhanVien savedNhanVien = nhanVienService.createNhanVien(nhanvienRequest,vaiTro);

        return new ResponseObject(savedNhanVien);
    }

//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadFile(
//            @ModelAttribute NhanVienRequest nhanVienRequest,
//            @RequestPart("anh") MultipartFile anh) {
//
//        // Handle the fields in nhanVienRequest and the file
//        // Example: Save the file, then process nhanVienRequest data
//
//        return ResponseEntity.ok("File uploaded successfully");
//    }

    // Ham lay danh sach tat ca Nhan vien
    // @GetMapping("/index")
    // public ResponseEntity<List<NhanVienDto>> getAllNhanViens() {
    // // List<NhanVienDto> nhanVienList = nhanVienService.getAllNhanVien();
    // // return ResponseEntity.ok(nhanVienList);
    // return null;
    // }

    // Lấy ra nhan vien theo id REST API
    // @GetMapping("/detail/{id}")
    // public ResponseEntity<NhanVienRequest> detail(@PathVariable("id") Integer id) {
    // NhanVienRequest nhanVienDto = nhanVienService.getNhanVienById(id);
    // return ResponseEntity.ok(nhanVienDto);
    // }

    // Hamf update theo id REST API
    @PutMapping("/update/{id}")
    public ResponseEntity<NhanVienDto> updateNhanVien(@PathVariable("id") Integer id, @RequestBody NhanVienDto updateNhanVien) {
        // NhanVienDto nhanVienDto = nhanVienService.update(id, updateNhanVien);
        // return ResponseEntity.ok(nhanVienDto);
        return null;
    }

    // Xoa theo id
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<String> delete(@PathVariable("id") Integer idNV) {
//        nhanVienService.delete(idNV);
//        return ResponseEntity.ok("Xóa thành công nhân viên");
//    }
}
