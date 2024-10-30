package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.employee.EmployeeRequest;
import com.example.be.dto.admin.response.employee.EmployeeResponse;
import com.example.be.entities.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByEmail(String email);
    @Query(value = """
        SELECT  
            a.id AS id,
            ac.id AS account,
            a.name AS name,
            a.code AS code,
            a.email AS email,
            a.image AS image,
            a.gender AS gender,
            a.date_of_birth AS dateOfBirth,
            a.phone_number AS phoneNumber,
            a.national_id AS nationalId,
            a.detailed_address AS detailedAddress,
            a.status AS status,
            a.deleted AS deleted,
            a.created_at AS createdAt,
            a.updated_at AS updatedAt,
            ROW_NUMBER() OVER(ORDER BY a.created_at ASC) AS indexs
        FROM employee a
        LEFT JOIN account ac ON ac.id = a.account_id
        WHERE (:#{#req.name} IS NULL
            OR a.code LIKE %:#{#req.name}% 
            OR a.name LIKE %:#{#req.name}% 
            OR a.national_id LIKE %:#{#req.name}% 
            OR a.email LIKE %:#{#req.name}%
            OR a.phone_number LIKE %:#{#req.name}%)
        AND (:#{#req.status} IS NULL OR a.status = :#{#req.status})
        """, nativeQuery = true)
    Page<EmployeeResponse> getAll(@Param("req") EmployeeRequest req, Pageable pageable);


    Boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByCode(String code);
    // Truy vấn tìm mã nhân viên lớn nhất
    @Query("SELECT e.code FROM Employee e ORDER BY e.code DESC LIMIT 1")
    String findMaxEmployeeCode();
    @Query(value = """

             SELECT 
                        a.id AS id,
                        ac.id AS account,
                        a.name AS name,
                        a.code AS code,
                        a.email AS email,
                        a.image AS image,
                        a.gender AS gender,
                        a.date_of_birth AS dateOfBirth,
                        a.phone_number AS phoneNumber,
                        a.national_id AS nationalId,
                        a.detailed_address AS detailedAddress,
                        a.status AS status,
                        a.deleted AS deleted,
                        a.created_at AS createdAt,
                        a.updated_at AS updatedAt,
                        ROW_NUMBER() OVER(ORDER BY a.created_at ASC) AS indexs
                    FROM employee a
                    LEFT JOIN account ac ON ac.id = a.account_id
                    WHERE a.id =:id ;
            """, nativeQuery = true)
    EmployeeResponse getOneEmpolyee(@Param("id") Integer id);

}
