package com.example.connectdb.util.converter;

import com.example.connectdb.dto.request.productDetail.ShirtDetailRequest;
import com.example.connectdb.entity.*;
import com.example.connectdb.repositories.*;
import com.example.connectdb.util.common.GenCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ShirtDetailConverter {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichCoRepository kichCoRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;
    @Autowired
    private CoAoRepository coAoRepository;
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Autowired
    private TayAoRepository tayAoRepository;

    public ChiTietSanPham convertRequestToEntity(ShirtDetailRequest request) {
        SanPham shoe = sanPhamRepository.findById(request.getSanPham()).get();
        MauSac color = mauSacRepository.findById(request.getMauSac()).get();
        KichCo size = kichCoRepository.findById(request.getKichCo()).get();
        CoAo collar = coAoRepository.findById(request.getCoAo()).get();
        ChatLieu material = chatLieuRepository.findById(request.getChatLieu()).get();
        ThuongHieu brand = thuongHieuRepository.findById(request.getThuongHieu()).get();
        TayAo sole = tayAoRepository.findById(request.getTayAo()).get();
        return ChiTietSanPham.builder()
                .sanPham(shoe).mauSac(color).kichCo(size).tayAo(sole).coAo(collar).chatLieu(material).thuongHieu(brand)
                .ma(GenCode.genCodeByName(shoe.getTen()
                        + color.getTen() + size.getTen() + sole.getTen()))
                .giaBan(request.getGiaBan()).soLuong(request.getSoLuong())
                .build();
    }

    public ChiTietSanPham convertRequestToEntity(ChiTietSanPham entity, ShirtDetailRequest request) {
        SanPham shoe = sanPhamRepository.findById(request.getSanPham()).get();
        MauSac color = mauSacRepository.findById(request.getMauSac()).get();
        KichCo size = kichCoRepository.findById(request.getKichCo()).get();
        TayAo sole = tayAoRepository.findById(request.getTayAo()).get();
        CoAo collar = coAoRepository.findById(request.getCoAo()).get();
        ThuongHieu brand = thuongHieuRepository.findById(request.getThuongHieu()).get();
        ChatLieu material = chatLieuRepository.findById(request.getChatLieu()).get();

        entity.setSanPham(shoe);
        entity.setMauSac(color);
        entity.setKichCo(size);
        entity.setChatLieu(material);
        entity.setCoAo(collar);
        entity.setTayAo(sole);
        entity.setThuongHieu(brand);
        entity.setMa(GenCode.genCodeByName(shoe.getTen()
                + color.getTen() + size.getTen() + sole.getTen()));
        entity.setGiaBan(request.getGiaBan());
        entity.setSoLuong(request.getSoLuong());
        return entity;
    }

    public ChiTietSanPham convertRequestToEntityFast(ChiTietSanPham entity, ShirtDetailRequest request) {
        entity.setGiaBan(request.getGiaBan());
        entity.setSoLuong(request.getSoLuong());
        return entity;
    }
}
