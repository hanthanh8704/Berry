package com.example.be.repository;

import com.example.be.entity.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChucVuRepository extends JpaRepository<ChucVu,Integer> {
    ChucVu findByVaiTro(String vaiTro);
}
