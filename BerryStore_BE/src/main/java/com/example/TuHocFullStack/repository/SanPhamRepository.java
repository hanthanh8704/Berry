package com.example.TuHocFullStack.repository;

import com.example.TuHocFullStack.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham , Integer> {
}
