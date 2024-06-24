package com.example.connectdb.assignment1;

import com.example.demo.entity.MauSac;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
@Repository
public class MauSacRepository {
    List<MauSac> listMS;

    public MauSacRepository() {
        this.listMS = new ArrayList<>();
        this.listMS.add(new MauSac(1, "MS01", "Màu sắc 1", 1));
        this.listMS.add(new MauSac(2, "MS02", "Màu sắc 2", 0));
        this.listMS.add(new MauSac(3, "MS03", "Màu sắc 3", 0));
    }

    public List<MauSac> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listMS.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listMS.size());
        return listMS.subList(start, end);
    }

    public List<MauSac> findAll() {
        return this.listMS;
    }

    public void create(MauSac ms) {
        ms.tangID();
        this.listMS.add(ms);
    }

    public void update(MauSac ms) {
        for (int i = 0; i < this.listMS.size(); i++) {
            MauSac p = this.listMS.get(i);
            if (p.getId() == ms.getId()) {
                this.listMS.set(i, ms);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listMS.size(); i++) {
            MauSac p = this.listMS.get(i);
            if (p.getId() == id) {
                this.listMS.remove(i);
            }
        }
    }

    public MauSac findById(Integer id) {
        for (int i = 0; i < this.listMS.size(); i++) {
            MauSac p = this.listMS.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }
    public List<MauSac> findByTimKiem(String timKiem) {
        List<MauSac> kq = new ArrayList<>();
        for (MauSac s : listMS) {
            if (s.getTen().equalsIgnoreCase(timKiem) || s.getMa().equalsIgnoreCase(timKiem)) {
                kq.add(s);
            }
        }
        return kq;
    }
}
