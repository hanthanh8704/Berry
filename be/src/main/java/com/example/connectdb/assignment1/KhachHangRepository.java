package com.example.connectdb.assignment1;

import com.example.demo.entity.KhachHang;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class KhachHangRepository {
    List<KhachHang> listKH;

    public KhachHangRepository() {
        this.listKH = new ArrayList<>();
        this.listKH.add(new KhachHang(1, "KH01", "Khách hàng 1", "0393977745", 1));
        this.listKH.add(new KhachHang(2, "KH02", "Khách hàng 2", "0966693478", 0));
        this.listKH.add(new KhachHang(3, "KH03", "Khách hàng 3", "0123456789", 1));
        this.listKH.add(new KhachHang(4, "KH04", "Khách hàng 4", "0987654321", 0));
        this.listKH.add(new KhachHang(5, "KH05", "Khách hàng 5", "0912345678", 1));
        this.listKH.add(new KhachHang(6, "KH06", "Khách hàng 6", "0923456789", 0));
        this.listKH.add(new KhachHang(7, "KH07", "Khách hàng 7", "0934567890", 1));
        this.listKH.add(new KhachHang(8, "KH08", "Khách hàng 8", "0945678901", 0));
        this.listKH.add(new KhachHang(9, "KH09", "Khách hàng 9", "0956789012", 1));
        this.listKH.add(new KhachHang(10, "KH10", "Khách hàng 10", "0967890123", 0));
    }

    public List<KhachHang> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listKH.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listKH.size());
        return listKH.subList(start, end);
    }

    public List<KhachHang> findAll() {
        return this.listKH;
    }

    public void create(KhachHang kh) {
        kh.tangID();
        this.listKH.add(kh);
    }

    public void update(KhachHang kh) {
        for (int i = 0; i < this.listKH.size(); i++) {
            KhachHang p = this.listKH.get(i);
            if (p.getId() == kh.getId()) {
                this.listKH.set(i, kh);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listKH.size(); i++) {
            KhachHang kh = this.listKH.get(i);
            if (kh.getId() == id) {
                this.listKH.remove(i);
            }
        }
    }

    public KhachHang findById(Integer id) {
        for (int i = 0; i < this.listKH.size(); i++) {
            KhachHang p = this.listKH.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<KhachHang> findByTimKiem(String timKiem) {
        List<KhachHang> kq = new ArrayList<>();
        for (KhachHang s : listKH) {
            if (s.getTen().equalsIgnoreCase(timKiem) || s.getMa().equalsIgnoreCase(timKiem)) {
                kq.add(s);
            }
        }
        return kq;
    }

    public KhachHang findBySDTkh(String sdt) {
        for (KhachHang k : listKH) {
            if (k.getSdt().equalsIgnoreCase(sdt)) {
                return k;
            }
        }
        return null;
    }

    public KhachHang findBytenKH(String tenKH) {
        for (KhachHang k : listKH) {
            if (k.getTen().equals(tenKH)) {
                return k;
            }
        }
        return null;
    }
}
