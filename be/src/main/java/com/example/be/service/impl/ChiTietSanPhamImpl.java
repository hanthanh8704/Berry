package com.example.be.service.impl;

import com.example.connectdb.dto.request.productDetail.FindShirtDetailRequest;
import com.example.connectdb.dto.request.productDetail.ShirtDetailRequest;
import com.example.connectdb.dto.request.productDetail.UpdateShirtDetailRequest;
import com.example.connectdb.dto.response.ShirtDetailResponse;
import com.example.connectdb.entity.Anh;
import com.example.connectdb.entity.ChiTietSanPham;
import com.example.connectdb.entity.SanPham;
import com.example.connectdb.repositories.*;
import com.example.connectdb.service.ChiTietSanPhamService;
import com.example.connectdb.util.common.GenCode;
import com.example.connectdb.util.common.PageableObject;
import com.example.connectdb.util.common.ResponseObject;
import com.example.connectdb.util.converter.ShirtDetailConverter;
import com.example.connectdb.util.exception.RestApiException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ChiTietSanPhamImpl implements ChiTietSanPhamService {
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Autowired
    private ShirtDetailConverter shoeDetailConvert;
    @Autowired
    private IImagesRepository anhRepository;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichCoRepository kichCoRepository;
    @Autowired
    private CoAoRepository coAoRepository;
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Autowired
    private TayAoRepository tayAoRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;

    private String genCode() {
        String prefix = "CTSP00";
        int x = 1;
        String code = prefix + x;
        while (chiTietSanPhamRepository.existsByMa(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public PageableObject<ShirtDetailResponse> getAll(FindShirtDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        FindShirtDetailRequest customRequest = FindShirtDetailRequest.builder()
                .mausacs(request.getMausac() != null ? Arrays.asList(request.getMausac().split(",")) : null)
                .sanphams(request.getSanpham() != null ? Arrays.asList(request.getSanpham().split(",")) : null)
                .kichcos(request.getKichco() != null ? Arrays.asList(request.getKichco().split(",")) : null)
                .tayaos(request.getTayao() != null ? Arrays.asList(request.getTayao().split(",")) : null)
                .kichco(request.getKichco())
                .mausac(request.getMausac())
                .sanpham(request.getSanpham())
                .tayao(request.getTayao())
                .ten(request.getTen())
                .build();
        return new PageableObject<>(chiTietSanPhamRepository.getAll(customRequest, pageable));
    }

    @Override
    public ChiTietSanPham getOne(Integer id) {
        return chiTietSanPhamRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public String create(List<ShirtDetailRequest> list) {
        for (ShirtDetailRequest request : list) {
            request.setMa(genCode());
            ChiTietSanPham convert = shoeDetailConvert.convertRequestToEntity(request);
            ChiTietSanPham check = chiTietSanPhamRepository.findBySanPhamIdAndMauSacIdAndKichCoIdAndChatLieuIdAndCoAoIdAndTayAoId(request.getSanPham(), request.getMauSac(), request.getKichCo(), request.getChatLieu(), request.getCoAo(), request.getTayAo());
            if (check != null) {
                check.setSoLuong(check.getSoLuong() + request.getSoLuong());
                chiTietSanPhamRepository.save(check);
            } else {
                request.setMa(genCode());
                ChiTietSanPham shoeDetailSave = chiTietSanPhamRepository.save(convert);
                SanPham shoe = shoeDetailSave.getSanPham();
                sanPhamRepository.save(shoe);
                if (request.getListImages().size() >= 5)
                    throw new RestApiException("Chỉ được thêm tối đa 5 hình ảnh!");
                if (shoeDetailSave != null) {
                    for (String x : request.getListImages()) {
                        anhRepository.save(Anh.builder().chiTietSanPham(shoeDetailSave).ten(x).trangThai("Hoạt động").build());
                    }
                }
            }
        }
        return "Thêm thành công!";
    }

    @Override
    @Transactional
    public ChiTietSanPham update(Integer id, UpdateShirtDetailRequest request) {
        ChiTietSanPham old = chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new RestApiException("ChiTietSanPham not found with id " + id));
        old.setGiaBan(request.getGiaBan());
        old.setSoLuong(request.getSoLuong());
        old.setKichCo(kichCoRepository.findByTen(request.getKichCo()));
        old.setTayAo(tayAoRepository.findByTen(request.getTayAo()));
        old.setMauSac(mauSacRepository.findByTen(request.getMauSac()));
        old.setChatLieu(chatLieuRepository.findByTen(request.getChatLieu()));
        old.setCoAo(coAoRepository.findByTen(request.getCoAo()));
        old.setThuongHieu(thuongHieuRepository.findByTen(request.getThuongHieu()));
        old.setMa(GenCode.genCodeByName(old.getSanPham().getTen()
                + request.getMauSac() + request.getKichCo() + request.getTayAo()));
        return chiTietSanPhamRepository.save(old);
    }


    @Override
    public ChiTietSanPham delete(Integer id) {
        return null;
    }

    @Override
    public ResponseObject updateFast(List<ShirtDetailRequest> list) {
        for (ShirtDetailRequest request : list) {
            ChiTietSanPham convert = shoeDetailConvert.convertRequestToEntityFast(chiTietSanPhamRepository.findById(request.getId()).get(), request);
            chiTietSanPhamRepository.save(convert);
        }
        return new ResponseObject(list);
    }

    @Override
    public Map<String, BigDecimal> findMinAndMaxPrice() {
        return chiTietSanPhamRepository.findMinAndMaxPrice();
    }

    @Override
    public ShirtDetailResponse getOneShoeDetail(Integer id) {
        return chiTietSanPhamRepository.getOneShoeDetail(id);
    }


}
