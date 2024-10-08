package com.poly.backend.repository;


import com.poly.backend.entity.English.Brand;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThuongHieuRepository  extends JpaRepository<Brand,Integer> {
}
