package com.poly.backend.repository;


import com.poly.backend.entity.English.Color;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MauSacRepository extends JpaRepository<Color,Integer> {
}
