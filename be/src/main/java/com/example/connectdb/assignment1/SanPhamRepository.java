package com.example.connectdb.assignment1;

import com.example.demo.entity.SanPham;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class SanPhamRepository {
    List<SanPham> listSP;

    public SanPhamRepository() {
        this.listSP = new ArrayList<>();
        this.listSP.add(new SanPham(1, "SP01", "San pham 1", 1));
        this.listSP.add(new SanPham(2, "SP02", "San pham 2", 0));
        this.listSP.add(new SanPham(3, "SP03", "San pham 3", 0));
    }

    public List<SanPham> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listSP.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listSP.size());
        return listSP.subList(start, end);
    }

    public List<SanPham> findAll() {
        return this.listSP;
    }

    public void create(SanPham sp) {
        sp.tangID();
        this.listSP.add(sp);
    }

    public void update(SanPham sp) {
        for (int i = 0; i < this.listSP.size(); i++) {
            SanPham p = this.listSP.get(i);
            if (p.getId() == sp.getId()) {
                this.listSP.set(i, sp);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listSP.size(); i++) {
            SanPham p = this.listSP.get(i);
            if (p.getId() == id) {
                this.listSP.remove(i);
            }
        }
    }

    public SanPham findById(Integer id) {
        for (int i = 0; i < this.listSP.size(); i++) {
            SanPham p = this.listSP.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }
    public List<SanPham> findByTimKiem(String timKiem) {
        List<SanPham> kq = new ArrayList<>();
        for (SanPham s : listSP) {
            if (s.getTen().equalsIgnoreCase(timKiem) || s.getMa().equalsIgnoreCase(timKiem)) {
                kq.add(s);
            }
        }
        return kq;
    }
}
