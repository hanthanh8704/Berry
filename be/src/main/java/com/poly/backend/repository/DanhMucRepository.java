package com.poly.backend.repository;


import com.poly.backend.entity.English.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DanhMucRepository extends JpaRepository<Category,Integer> {
}
