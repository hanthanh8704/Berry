//package com.example.connectdb.util.converter;
//
//import com.example.connectdb.dto.request.productDetail.ShirtDetailRequest;
//import com.example.connectdb.entity.*;
//import com.example.connectdb.repositories.KichCoRepository;
//import com.example.connectdb.repositories.MauSacRepository;
//import com.example.connectdb.repositories.SanPhamRepository;
//import com.example.connectdb.repositories.TayAoRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component
//public class ShirtDetailConverter {
//
//    @Autowired
//    private SanPhamRepository sanPhamRepository;
//    @Autowired
//    private MauSacRepository mauSacRepository;
//    @Autowired
//    private KichCoRepository kichCoRepository;
//    @Autowired
//    private TayAoRepository tayAoRepository;
//
//    public ShirtDetailConverter convertRequestToEntity(ShirtDetailRequest request) {
//        SanPham shoe = sanPhamRepository.findById(request.getSanPham()).get();
//        MauSac color = mauSacRepository.findById(request.getMauSac()).get();
//        KichCo size = kichCoRepository.findById(request.getKichCo()).get();
//        TayAo sole = tayAoRepository.findById(request.getTayAo()).get();
//        return ChiTietSanPham.builder()
//                .build();
//    }
//
//    public ShoeDetail convertRequestToEntity(ShoeDetail entity, ShoeDetailRequest request) {
//        Shoe shoe = shoeRepository.findById(request.getShoe()).get();
//        Color color = colorRepository.findById(request.getColor()).get();
//        Size size = sizeRepository.findById(request.getSize()).get();
//        Sole sole = soleRepository.findById(request.getSole()).get();
//
//        entity.setShoe(shoe);
//        entity.setColor(color);
//        entity.setSize(size);
//        entity.setCode(GenCode.genCodeByName(shoe.getName()
//                + color.getName() + size.getName() + sole.getName()));
//        entity.setPrice(request.getPrice());
//        entity.setQuantity(request.getQuantity());
//        entity.setWeight(request.getWeight());
//        return entity;
//    }
//
//    public ShoeDetail convertRequestToEntityFast(ShoeDetail entity, ShoeDetailRequest request) {
//        entity.setPrice(request.getPrice());
//        entity.setQuantity(request.getQuantity());
//        entity.setWeight(request.getWeight());
//        return entity;
//    }
//}
