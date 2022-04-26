package com.example.placementmanager.repositories;

import java.time.LocalDate;
import java.util.List;

import com.example.placementmanager.classes.CompanyDrive;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyDriveRepository extends JpaRepository<CompanyDrive, Long>{
    List<CompanyDrive> findByNameAndStream(String name, String stream);

    List<CompanyDrive> findByDeadlineDateGreaterThan(LocalDate dt);

    @Modifying
    @Query(value="DELETE FROM company_student cp WHERE cp.company_id=:companyId AND cp.student_id=:studentId", nativeQuery=true)
    void deleteStudent(@Param("companyId") Long companyId, @Param("studentId") Long studentId);

    @Modifying
    @Query(value="UPDATE company_drive cp SET cp.meeting_link=:meetingLink, cp.test_link=:testLink, cp.info=:info, cp.job_description=:jobDesc, cp.job_pay=:jobPay WHERE cp.company_id=:companyId", nativeQuery = true)
    void updateDetails(@Param("companyId") Long companyId, @Param("meetingLink") String meetingLink, @Param("testLink") String testLink, 
        @Param("info") String info, @Param("jobDesc") String jobDescription, @Param("jobPay") String jobPay);
}
