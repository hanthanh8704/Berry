package com.example.be.service.impl;

import com.example.be.dto.request.khachHang.DiaChiRequest;
import com.example.be.dto.response.DiaChiResponse;
import com.example.be.entity.DiaChi;
import com.example.be.entity.KhachHang;
import com.example.be.repository.DiaChiRepository;
import com.example.be.repository.KhachHangRepository;
import com.example.be.service.DiaChiService;
import com.example.be.util.converter.DiaChiConvert;
import com.example.be.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaChiImpl implements DiaChiService {
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private DiaChiRepository addressRepository;
    @Autowired
    private DiaChiConvert addressConvert;

    @Override
    public Page<DiaChiResponse> getByAccount(Integer id, DiaChiRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return addressRepository.getAddress(id, pageable);
    }

    private KhachHang getIdKhachHangFromDiaChi(Integer idKhachHang) {
        return khachHangRepository.findById(idKhachHang)
                .orElseThrow(() -> new IllegalArgumentException("KhachHang with id " + idKhachHang + " not found"));
    }
    @Override
    public DiaChi create(DiaChiRequest request) {
        // Print out information for debugging
        System.out.println("Attempting to create new address:");
        System.out.println("Dia chi cu the: " + request.getDiaChiCuThe());
        System.out.println("Phuong: " + request.getPhuong());
        System.out.println("Huyen: " + request.getHuyen());
        System.out.println("Thanh pho: " + request.getThanhPho());
        System.out.println("Id KhachHang: " + request.getIdKhachHang());

        // Convert DiaChiRequest to DiaChi entity
        DiaChi entity = addressConvert.convertRequestToEntity(request);

        // Set idKhachHang from request
        if (request.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy KhachHang với id: " + request.getIdKhachHang()));
            entity.setIdKhachHang(khachHang);
        } else {
            System.out.println("idKhachHang is null");
        }

        // Save the entity
        DiaChi savedAddress = addressRepository.save(entity);

        // Print out success message
        System.out.println("Address created successfully: " + savedAddress);

        return savedAddress;
    }





//    public DiaChi create(DiaChiRequest request) {
//        // Check if ID KhachHang is provided
//        if (request.getIdKhachHang() == null) {
//            throw new RestApiException("Không thể tạo địa chỉ với ID KhachHang null");
//        }
//
//        // Load KhachHang entity
//        KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
//                .orElseThrow(() -> new RestApiException("Không tìm thấy KhachHang với id: " + request.getIdKhachHang()));
//
//        // Convert request to entity
//        DiaChi diaChi = addressConvert.convertRequestToEntity(request);
//
//        // Set KhachHang entity to DiaChi
//        diaChi.setIdKhachHang(khachHang);
//
//        // Set other fields from request
//        diaChi.setHoTen(request.getHoTen());
//        diaChi.setSoDienThoai(request.getSoDienThoai());
//        diaChi.setThanhPho(request.getThanhPho());
//        diaChi.setHuyen(request.getHuyen());
//        diaChi.setPhuong(request.getPhuong());
//        diaChi.setDiaChiMacDinh(request.getDiaChiMacDinh());
//        diaChi.setDiaChiCuThe(request.getDiaChiCuThe());
//
//        // Save and return the created entity
//        return addressRepository.save(diaChi);
//    }



    @Override
    public DiaChi update(Integer id, DiaChiRequest request) {
        // Tìm địa chỉ cần sửa theo id
        DiaChi diaChiToUpdate = addressRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Không tìm thấy địa chỉ với id: " + id));

        // Cập nhật thông tin của địa chỉ từ request
        if (request.getIdKhachHang() != null) {
            KhachHang khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new RestApiException("Không tìm thấy KhachHang với id: " + request.getIdKhachHang()));
            diaChiToUpdate.setIdKhachHang(khachHang);
            System.out.println("ID Khach hang: " + request.getIdKhachHang());
        }
        diaChiToUpdate.setHoTen(request.getHoTen());
        System.out.println("Ho ten: " + request.getHoTen());
        diaChiToUpdate.setSoDienThoai(request.getSoDienThoai());
        System.out.println("SDT :" + request.getSoDienThoai());
        diaChiToUpdate.setThanhPho(request.getThanhPho());
        System.out.println("Thanh pho: " + request.getThanhPho());
        diaChiToUpdate.setHuyen(request.getHuyen());
        System.out.println("Huyen: " + request.getHuyen());
        diaChiToUpdate.setPhuong(request.getPhuong());
        System.out.println("Phuong: " + request.getPhuong());
        diaChiToUpdate.setDiaChiMacDinh(request.getDiaChiMacDinh());
        System.out.println("Dia chi mac dinh: " + request.getDiaChiMacDinh());
        diaChiToUpdate.setDiaChiCuThe(request.getDiaChiCuThe());
        System.out.println("Dia chi cu the: " + request.getDiaChiCuThe());
        diaChiToUpdate.setTrangThai(request.getTrangThai());
        System.out.println("Trang thai: " + request.getTrangThai());
        diaChiToUpdate.setNguoiTao(request.getNguoiTao());
        System.out.println("Nguoi tao: " + request.getNguoiTao());
        diaChiToUpdate.setNguoiSua(request.getNguoiSua());
        System.out.println("Nguoi sua: " + request.getNguoiSua());

        // Lưu và trả về đối tượng đã được cập nhật
        return addressRepository.save(diaChiToUpdate);
    }


    @Override
    public DiaChi delete(Integer id) {
        DiaChi address = addressRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Không tìm thấy địa chỉ"));

        // Kiểm tra số lượng địa chỉ của khách hàng chưa bị xóa
        List<DiaChi> diaChiList = addressRepository.findAllByIdKhachHangAndDeletedFalse(address.getIdKhachHang().getId());
        if (diaChiList.size() > 1) {
            addressRepository.delete(address);
            System.out.println("Xóa thành công"); // Optional: Log success
            return address; // Return the deleted address
        } else {
            throw new RestApiException("Không thể xóa địa chỉ này!");
        }
    }

}
