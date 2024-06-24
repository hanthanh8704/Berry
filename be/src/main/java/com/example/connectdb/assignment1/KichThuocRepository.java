package com.example.connectdb.assignment1;

import com.example.demo.entity.KichThuoc;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class KichThuocRepository {
    List<KichThuoc> listKT;

    public KichThuocRepository() {
        this.listKT = new ArrayList<>();
        this.listKT.add(new KichThuoc(1, "KT01", "Kích thước 1", 1));
        this.listKT.add(new KichThuoc(2, "KT02", "Kích thước 2", 0));
        this.listKT.add(new KichThuoc(3, "KT03", "Kích thước 3", 0));
    }

    public List<KichThuoc> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listKT.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listKT.size());
        return listKT.subList(start, end);
    }

    public List<KichThuoc> findAll() {
        return this.listKT;
    }

    public void create(KichThuoc kt) {
        kt.tangID();
        this.listKT.add(kt);
    }

    public void update(KichThuoc kt) {
        for (int i = 0; i < this.listKT.size(); i++) {
            KichThuoc p = this.listKT.get(i);
            if (p.getId() == kt.getId()) {
                this.listKT.set(i, kt);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listKT.size(); i++) {
            KichThuoc p = this.listKT.get(i);
            if (p.getId() == id) {
                this.listKT.remove(i);
            }
        }
    }

    public KichThuoc findById(Integer id) {
        for (int i = 0; i < this.listKT.size(); i++) {
            KichThuoc p = this.listKT.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<KichThuoc> findByTimKiem(String timKiem) {
        List<KichThuoc> kq = new ArrayList<>();
        for (KichThuoc s : listKT) {
            if (s.getTen().equalsIgnoreCase(timKiem) || s.getMa().equalsIgnoreCase(timKiem)) {
                kq.add(s);
            }
        }
        return kq;
    }
}
