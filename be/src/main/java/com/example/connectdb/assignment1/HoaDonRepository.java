package com.example.connectdb.assignment1;

import com.example.demo.entity.HoaDon;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class HoaDonRepository {
    private List<HoaDon> listHD;

    public HoaDonRepository() {
        this.listHD = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        try {
            this.listHD.add(new HoaDon(1, 1, 1, "HD01", LocalDate.parse("20-03-2024", dateFormatter), 1));
            this.listHD.add(new HoaDon(2, 2, 2, "HD02", LocalDate.parse("22-03-2024", dateFormatter), 0));
            this.listHD.add(new HoaDon(3, 3, 3, "HD03", LocalDate.parse("26-03-2024", dateFormatter), 1));
        } catch (DateTimeParseException e) {
            e.printStackTrace();
        }
    }

    public List<HoaDon> findAllPaging(int page, int size) {
        int start = (page - 1) * size;
        if (start >= listHD.size()) {
            return new ArrayList<>();
        }
        int end = Math.min(start + size, listHD.size());
        return listHD.subList(start, end);
    }

    public List<HoaDon> findAll() {
        return this.listHD;
    }

    public void create(HoaDon kh) {
        kh.tangID();
        this.listHD.add(kh);
    }

    public void update(HoaDon hd) {
        for (int i = 0; i < this.listHD.size(); i++) {
            HoaDon p = this.listHD.get(i);
            if (p.getId() == hd.getId()) {
                this.listHD.set(i, hd);
            }
        }
    }

    public void deleteById(Integer id) {
        for (int i = 0; i < this.listHD.size(); i++) {
            HoaDon hd = this.listHD.get(i);
            if (hd.getId() == id) {
                this.listHD.remove(i);
            }
        }
    }

    public HoaDon findById(Integer id) {
        for (int i = 0; i < this.listHD.size(); i++) {
            HoaDon p = this.listHD.get(i);
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    public List<HoaDon> findByIdKh(int idKH) {
        List<HoaDon> kq = new ArrayList<>();
        for (HoaDon s : listHD) {
            if (s.getIdKH() == idKH) {
                kq.add(s);
            }
        }
        return kq;
    }

}
