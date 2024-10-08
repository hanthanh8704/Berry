package com.poly.backend.repository;


import com.poly.backend.entity.English.Size;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KichCoRepository extends JpaRepository<Size,Integer> {
}
