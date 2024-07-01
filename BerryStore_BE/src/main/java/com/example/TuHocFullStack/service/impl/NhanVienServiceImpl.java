//package com.example.TuHocFullStack.service.impl;
//
//import com.example.TuHocFullStack.dto.NhanVienDto;
//import com.example.TuHocFullStack.entity.NhanVien;
//import com.example.TuHocFullStack.exception.ResourceNotFoundException;
//import com.example.TuHocFullStack.mapper.NhanVienMapper;
//import com.example.TuHocFullStack.repository.NhanVienRepository;
//import com.example.TuHocFullStack.service.NhanVienService;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//
//@Service
//@AllArgsConstructor
//public class NhanVienServiceImpl implements NhanVienService {
//    private final NhanVienRepository nhanVienRepository;
//
//    @Override
//    public NhanVienDto createNhanVien(NhanVienDto nhanVienDto) {
//        NhanVien nhanVien = NhanVienMapper.mapToNhanVien(nhanVienDto);
//        NhanVien savedNhanVien = nhanVienRepository.save(nhanVien);
//        return NhanVienMapper.mapToNhanVienDto(savedNhanVien);
//    }
//
//    @Override
//    public List<NhanVienDto> getAllNhanVien() {  // Thay đổi tên phương thức khớp với interface
//        List<NhanVien> nhanVien = nhanVienRepository.findAll();
//        return nhanVien.stream()
//                .map(NhanVienMapper::mapToNhanVienDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public NhanVienDto getNhanVienById(Integer idNV) {
////        NhanVien nhanVien = nhanVienRepository.findById(idNV).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với id : " + idNV));
////        return NhanVienMapper.mapToNhanVienDto(nhanVien);
//    }
//
//    @Override
//    public NhanVienDto update(Integer idNV, NhanVienDto UpdatenhanVienDto) {
////        NhanVien nhanVien = nhanVienRepository.findById(idNV).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với id : " + idNV));
////        nhanVien.setTen(UpdatenhanVienDto.getTen());
////        nhanVien.setTuoi(UpdatenhanVienDto.getTuoi());
////        nhanVien.setDiaChi(UpdatenhanVienDto.getDiaChi());
////        nhanVien.setTrangThai(UpdatenhanVienDto.getTrangThai());
////        NhanVien updateNhanVienObj = nhanVienRepository.save(nhanVien);
////        return NhanVienMapper.mapToNhanVienDto(updateNhanVienObj);
//    }
//
//    @Override
//    public void delete(Integer idNV) {
////        NhanVien nhanVien = nhanVienRepository.findById(idNV).orElseThrow(()
////                -> new ResourceNotFoundException("Không tìm thấy nhân viên với id : " + idNV));
////        nhanVienRepository.delete(nhanVien);
//
//    }
//
//}