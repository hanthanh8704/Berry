package com.example.connectdb.assignment1;

import com.example.demo.entity.SPCT;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class SPCT_Repository {
    List<SPCT> listSPCT = new ArrayList<>();

    public SPCT_Repository() {
        this.listSPCT.add(new SPCT(1, "SPCT1", 1, 1, 1, 3, 18.0, 0));
        this.listSPCT.add(new SPCT(2, "SPCT2", 2, 2, 2, 5, 16.0, 1));
        this.listSPCT.add(new SPCT(3, "SPCT3", 3, 3, 3, 15, 26.0, 1));
    }

    public List<SPCT> findAll() {
        return this.listSPCT;
    }

    public List<SPCT> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listSPCT.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listSPCT.size());
        return listSPCT.subList(start, end);
    }

    public void create(SPCT spct) {
        spct.tangID();
        this.listSPCT.add(spct);
    }

    public void update(SPCT spct) {
        for (int i = 0; i < this.listSPCT.size(); i++) {
            SPCT p = this.listSPCT.get(i);
            if (p.getId() == spct.getId()) {
                this.listSPCT.set(i, spct);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listSPCT.size(); i++) {
            SPCT hd = this.listSPCT.get(i);
            if (hd.getId() == id) {
                this.listSPCT.remove(i);
            }
        }
    }

    public SPCT findById(Integer id) {
        for (int i = 0; i < this.listSPCT.size(); i++) {
            SPCT p = this.listSPCT.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<SPCT> findByIdSp(int idSP) {
        List<SPCT> kq = new ArrayList<>();
        for (SPCT s : listSPCT) {
            if (s.getIdSanPham() == idSP) {
                kq.add(s);
            }
        }
        return kq;
    }

}
