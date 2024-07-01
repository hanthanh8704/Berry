package com.example.be.service.impl;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDonChiTiet;
import com.example.be.repository.HoaDonChiTietRepository;
import com.example.be.service.HoaDonChiTietService;
import com.example.be.util.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonChiTietImpl implements HoaDonChiTietService {
    private final HoaDonChiTietRepository hoaDonDonChiTietRepository;

    @Autowired
    public HoaDonChiTietImpl(HoaDonChiTietRepository hoaDonDonChiTietRepository) {
        this.hoaDonDonChiTietRepository = hoaDonDonChiTietRepository;
    }

    @Override
    public PageableObject<HoaDonChiTietResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(hoaDonDonChiTietRepository.getAllHoaDonChiTiet(request, pageable));
    }

    // Hàm getOne
    // Hàm getOne s�� lấy một đơn đặt hàng theo ID đã truyền vào. Nếu ID không tồn tại, hàm s�� trả về null.
    // Hàm getOne sử dụng Repository.findById() để tìm đơn đặt hàng theo ID. Nếu ID tồn tại, hàm s�� trả về đơn đặt hàng, ngược lại, hàm s�� trả về null.
    // Hàm getOne sử dụng @Query annotation để tạo truy vấn truy xuất dữ liệu.
    // Hàm getOne sử dụng @Entity annotation để khai báo đối tượng đơn đặt hàng.
    // Hàm getOne sử dụng @Param annotation để truyền tham số cho truy vấn.
    // Hàm getOne sử dụng @Value annotation để truyền giá trị cho truy vấn.
    // Hàm getOne sử dụng @Projection annotation để đ��nh ngh��a trư��ng dữ liệu trả về từ đối tượng đơn đặt hàng.
    @Override
    public HoaDonChiTiet getOne(Integer id) {
        return hoaDonDonChiTietRepository.findById(id).orElse(null);
    }

    @Override
    public List<HoaDonChiTiet> findByHoaDonId(Integer idHoaDon) {
        return hoaDonDonChiTietRepository.findByHoaDonId(idHoaDon);
    }
}
