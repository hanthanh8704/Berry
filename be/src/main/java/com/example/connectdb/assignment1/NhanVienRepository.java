package com.example.connectdb.assignment1;

import com.example.demo.entity.NhanVien;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class NhanVienRepository {
    List<NhanVien> listNV;

    public NhanVienRepository() {
        this.listNV = new ArrayList<>();
        this.listNV.add(new NhanVien(1, "NV01", "Nhân viên 1", "ducnmph40593@fpt.edu.vn", "khongbiet123", "Admin", 1));
        this.listNV.add(new NhanVien(2, "NV02", "Nhân viên 2", "quannmph40595@fpt.edu.vn", "batcandoi123", "Admin", 0));
        this.listNV.add(new NhanVien(3, "NV03", "Nhân viên 3", "nhanvien3@fpt.edu.vn", "password3", "Nhân viên", 1));
        this.listNV.add(new NhanVien(4, "NV04", "Nhân viên 4", "nhanvien4@fpt.edu.vn", "password4", "Admin", 0));
        this.listNV.add(new NhanVien(5, "NV05", "Nhân viên 5", "nhanvien5@fpt.edu.vn", "password5", "Nhân viên", 1));
        this.listNV.add(new NhanVien(6, "NV06", "Nhân viên 6", "nhanvien6@fpt.edu.vn", "password6", "Admin", 0));
        this.listNV.add(new NhanVien(7, "NV07", "Nhân viên 7", "nhanvien7@fpt.edu.vn", "password7", "Nhân viên", 1));
        this.listNV.add(new NhanVien(8, "NV08", "Nhân viên 8", "nhanvien8@fpt.edu.vn", "password8", "Admin", 0));
        this.listNV.add(new NhanVien(9, "NV09", "Nhân viên 9", "nhanvien9@fpt.edu.vn", "password9", "Nhân viên", 1));
        this.listNV.add(new NhanVien(10, "NV10", "Nhân viên 10", "nhanvien10@fpt.edu.vn", "password10", "Admin", 0));
    }

    public List<NhanVien> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listNV.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listNV.size());
        return listNV.subList(start, end);
    }


    public List<NhanVien> findAll() {
        return this.listNV;
    }

    public void create(NhanVien nv) {
        nv.tangID();
        this.listNV.add(nv);
    }

    public void update(NhanVien nv) {
        for (int i = 0; i < this.listNV.size(); i++) {
            NhanVien p = this.listNV.get(i);
            if (p.getId() == nv.getId()) {
                this.listNV.set(i, nv);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listNV.size(); i++) {
            NhanVien p = this.listNV.get(i);
            if (p.getId() == id) {
                this.listNV.remove(i);
            }
        }
    }

    public NhanVien findById(Integer id) {
        for (int i = 0; i < this.listNV.size(); i++) {
            NhanVien p = this.listNV.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<NhanVien> findByTimKiem(String timKiem) {
        List<NhanVien> kq = new ArrayList<>();
        for (NhanVien s : listNV) {
            if (s.getTen().equalsIgnoreCase(timKiem) || s.getMa().equalsIgnoreCase(timKiem)) {
                kq.add(s);
            }
        }
        return kq;
    }

    public NhanVien findByRole(String tenDN) {
        if (tenDN == null) {
            return null;
        }
        for (int i = 0; i < this.listNV.size(); i++) {
            NhanVien p = this.listNV.get(i);
            if (p.getTenDN().equals(tenDN)) {
                return p;
            }
        }
        return null;
    }

    public NhanVien findByTen(String tenNV) {
        if (tenNV == null) {
            return null;
        }
        for (int i = 0; i < this.listNV.size(); i++) {
            NhanVien p = this.listNV.get(i);
            if (p.getTen().equals(tenNV)) {
                return p;
            }
        }
        return null;
    }
}
