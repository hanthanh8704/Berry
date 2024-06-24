package com.example.connectdb.assignment1;

import com.example.demo.entity.HDCT;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class HDCT_Repository {
    private List<HDCT> listHDCT = new ArrayList<>();

    public HDCT_Repository() {

//        this.listHDCT.add(new HDCT(1, 1, 1, 2, 23.0, 46.0, 1));
//        this.listHDCT.add(new HDCT(2, 2, 2, 3, 20.0, 60.0, 0));
    }

    public List<HDCT> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listHDCT.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listHDCT.size());
        return listHDCT.subList(start, end);
    }

    public List<HDCT> findAll() {
        return this.listHDCT;
    }

    public void create(HDCT hdct) {
        hdct.tangID();
        this.listHDCT.add(hdct);
    }

    public void update(HDCT hdct) {
        for (int i = 0; i < this.listHDCT.size(); i++) {
            HDCT p = this.listHDCT.get(i);
            if (p.getId() == hdct.getId()) {
                this.listHDCT.set(i, hdct);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listHDCT.size(); i++) {
            HDCT hd = this.listHDCT.get(i);
            if (hd.getId() == id) {
                this.listHDCT.remove(i);
            }
        }
    }

    public HDCT findById(Integer id) {
        for (int i = 0; i < this.listHDCT.size(); i++) {
            HDCT p = this.listHDCT.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<HDCT> findByIdHd(int idHD) {
        List<HDCT> kq = new ArrayList<>();
        for (HDCT s : listHDCT) {
            if (s.getIdHD() == idHD) {
                kq.add(s);
            }
        }
        return kq;
    }

//    public List<HDCT> getListIdHoaDon(int idHD) {
//        List<HDCT> kq = new ArrayList<>();
//        for (HDCT s : listHDCT) {
//            if (s.getIdHD() == idHD) {
//                kq.add(s);
//            }
//        }
//        return kq;
//    }

    public List<HDCT> findByIdSPCT(int idSPCT) {
        List<HDCT> kq = new ArrayList<>();
        for (HDCT s : listHDCT) {
            if (s.getIdSPCT() == idSPCT) {
                kq.add(s);
            }
        }
        return kq;
    }

    public void updateSoLuong(HDCT hoaDonCT) {
        for (int i = 0; i < this.listHDCT.size(); i++) {
            HDCT p = this.listHDCT.get(i);
            if (p.getId() == hoaDonCT.getId()) {
                p.setSoLuong(hoaDonCT.getSoLuong());
                p.setTongTien(hoaDonCT.getTongTien());
                // Bạn không cần thêm đối tượng hoaDonCT vào danh sách mà chỉ cần cập nhật thông tin của đối tượng HDCT hiện tại
                this.listHDCT.set(i, p);
            }
        }
    }
}
