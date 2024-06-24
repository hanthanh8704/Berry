package com.example.connectdb.controllers;

import com.example.demo.entity.*;
import com.example.demo.repository.assignment1.*;
import com.example.demo.securityConfig.AuthChecker;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("ban-hang")
public class BanHangController {

    HoaDonRepository hoaDonRepository = new HoaDonRepository();
    List<HoaDon> listHD;

    HDCT_Repository hdctRepository = new HDCT_Repository();
    List<HDCT> listHDCT;

    KhachHangRepository khachHangRepository = new KhachHangRepository();
    List<KhachHang> listKH;

    KichThuocRepository kichThuocRepository = new KichThuocRepository();
    List<KichThuoc> listKT;

    MauSacRepository mauSacRepository = new MauSacRepository();
    List<MauSac> listMS;

    NhanVienRepository nhanVienRepository = new NhanVienRepository();
    List<NhanVien> listNV = new ArrayList<>();

    SanPhamRepository sanPhamRepository = new SanPhamRepository();
    List<SanPham> listSP;

    SPCT_Repository spct_repository = new SPCT_Repository();
    List<SPCT> listSPCT;

    HoaDon hoaDonDetail;
    KhachHang khachHangDetail;
    Integer idHoaDon;
    double tongTien;

    public BanHangController() {
        listSPCT = new ArrayList<>();
        listSP = new ArrayList<>();
        listMS = new ArrayList<>();
        listKH = new ArrayList<>();
        listKT = new ArrayList<>();
        listHDCT = new ArrayList<>();
        listHD = new ArrayList<>();
        hoaDonDetail = new HoaDon();
        khachHangDetail = new KhachHang();
        idHoaDon = 1;
        tongTien = 0;
    }

    @GetMapping("index")
    public String getIndex(Model model, HttpSession session, @RequestParam(name = "sdtKH", defaultValue = "") String sdtKH) {
        if (!AuthChecker.isLoggedIn(session)) {
            session.setAttribute("error", "Bạn phải đăng nhập trước.");
            return "redirect:/login";
        }
        if (sdtKH.isEmpty()) {
            listNV = this.nhanVienRepository.findAll();
            model.addAttribute("listNV", listNV);
            listKH = this.khachHangRepository.findAll();
            model.addAttribute("listKH", listKH);
            listHD = this.hoaDonRepository.findAll();
            model.addAttribute("listHD", listHD);
            listHDCT = this.hdctRepository.findAll();
            model.addAttribute("listHDCT", listHDCT);
            listKT = this.kichThuocRepository.findAll();
            model.addAttribute("listKT", listKT);
            listMS = this.mauSacRepository.findAll();
            model.addAttribute("listMS", listMS);
            listSP = this.sanPhamRepository.findAll();
            model.addAttribute("listSP", listSP);
            listSPCT = this.spct_repository.findAll();
            model.addAttribute("listSPCT", listSPCT);

            model.addAttribute("hoaDonDetail", hoaDonDetail);
            model.addAttribute("khachHangDetail", khachHangDetail);
            model.addAttribute("tongTien", tongTien);
        } else {
            KhachHang listKHDetail = khachHangRepository.findBySDTkh(sdtKH);
            model.addAttribute("listKHDetail", listKHDetail);
        }
        return "ban_hang/index";
    }

    @GetMapping("search")
    public String search(Model model, @RequestParam(name = "sdtKH", defaultValue = "") String sdtKH) {
        KhachHang listKHDetail = khachHangRepository.findBySDTkh(sdtKH);
        model.addAttribute("listKHDetail", listKHDetail);

        listNV = this.nhanVienRepository.findAll();
        model.addAttribute("listNV", listNV);
        listKH = this.khachHangRepository.findAll();
        model.addAttribute("listKH", listKH);
        listHD = this.hoaDonRepository.findAll();
        model.addAttribute("listHD", listHD);
        listHDCT = this.hdctRepository.findAll();
        model.addAttribute("listHDCT", listHDCT);
        listKT = this.kichThuocRepository.findAll();
        model.addAttribute("listKT", listKT);
        listMS = this.mauSacRepository.findAll();
        model.addAttribute("listMS", listMS);
        listSP = this.sanPhamRepository.findAll();
        model.addAttribute("listSP", listSP);
        listSPCT = this.spct_repository.findAll();
        model.addAttribute("listSPCT", listSPCT);

        return "ban_hang/index";
    }

    @PostMapping("tao-hoa-don/{id}")
    private String taoHoaDon(Model model, HoaDon hd, @RequestParam(name = "tenKH", defaultValue = "") String tenKH,
                             @PathVariable("id") Integer idNV) {

        KhachHang kh = khachHangRepository.findBytenKH(tenKH);
        hd.setIdKH(kh.getId());
        hd.setTrangThai(1);
        hd.setIdNV(1);
        LocalDate today = LocalDate.now();
        hd.setNgayMuaHang(today);
        hd.setIdNV(idNV);
        System.out.println("ID nhan vien" + idNV);
        hoaDonRepository.create(hd);
        return "redirect:/ban-hang/index";
    }

    @GetMapping("deleteHDCT/{id}")
    public String deleteHDCT(Model model, @PathVariable("id") Integer idHDCT) {
        tongTien = 0;
        for (HDCT hdct : listHDCT) {
            tongTien += hdct.getDonGia();
        }
        hdctRepository.deleteById(idHDCT);
        return "redirect:/ban-hang/index";
    }

    @GetMapping("selectHD/{id}")
    public String selectHD(Model model, @PathVariable("id") Integer idHoaDon) {

        hoaDonDetail = hoaDonRepository.findById(idHoaDon);

        khachHangDetail = khachHangRepository.findById(hoaDonDetail.getIdKH());

        listHDCT = hdctRepository.findByIdHd(idHoaDon);

        System.out.println("idHD" + idHoaDon);

        System.out.println("danh sach" + listHDCT);
        tongTien = 0;
        for (HDCT hdct : listHDCT) {
            tongTien += hdct.getDonGia();
        }
        return "redirect:/ban-hang/index";
    }

    @GetMapping("selectSPCT/{id}")
    public String selectSPCT(Model model, @PathVariable("id") Integer id) {
        SPCT chiTietSanPhamDetail = spct_repository.findById(id);
        boolean daCoTrongHoaDon = false;
        for (HDCT hoaDonCT : listHDCT) {
            if (hoaDonCT.getIdSPCT() == id) {
                int newSoLuong = hoaDonCT.getSoLuong() + 1;
                hoaDonCT.setSoLuong(newSoLuong);
                hoaDonCT.setTongTien(newSoLuong * hoaDonCT.getDonGia());

                chiTietSanPhamDetail.setSoLuong(chiTietSanPhamDetail.getSoLuong() - 1);
                spct_repository.update(chiTietSanPhamDetail);

                hdctRepository.updateSoLuong(hoaDonCT);

                daCoTrongHoaDon = true;
            }
        }
        if (!daCoTrongHoaDon) {
            HDCT hoaDonChiTiet = new HDCT();

            hoaDonChiTiet.setIdHD(idHoaDon);

            hoaDonChiTiet.setIdSPCT(chiTietSanPhamDetail.getId());
            hoaDonChiTiet.setDonGia(chiTietSanPhamDetail.getDonGia());
            hoaDonChiTiet.setSoLuong(1);
            hoaDonChiTiet.setTrangThai(1);
            hoaDonChiTiet.setTongTien(chiTietSanPhamDetail.getDonGia() * 1);

            hdctRepository.create(hoaDonChiTiet);

            chiTietSanPhamDetail.setSoLuong(chiTietSanPhamDetail.getSoLuong() - 1);
            spct_repository.update(chiTietSanPhamDetail);
        }
        
            listHDCT = hdctRepository.findByIdHd(idHoaDon);
            tongTien = 0;
            for (HDCT hoaDonCT : listHDCT) {
                tongTien += hoaDonCT.getTongTien();
            }

            System.out.println(tongTien);

        return "redirect:/ban-hang/index";
    }

}
