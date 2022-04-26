package com.example.placementmanager.repositories;

import java.util.List;

import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.classes.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>{
    List<Student> findByRegDetails(RegistrationDetails regDet);

    

    @Modifying
    @Query(value="INSERT INTO company_student (company_id, student_id) VALUES (:companyId, :studentId)", nativeQuery = true)
    void updateStudentByCompanyId(@Param("studentId") Long studentId, @Param("companyId") Long companyId);

    @Modifying
    @Query(value="UPDATE student st SET st.first_name=:firstName, st.last_name=:lastName, st.software_resume=:softwareResume WHERE st.student_id=:studentId", nativeQuery = true)
    void updateStudentProfile(@Param("studentId") Long studentId, @Param("firstName") String firstName, @Param("lastName") String lastName,
        @Param("softwareResume") byte[] softwareResume);
}
