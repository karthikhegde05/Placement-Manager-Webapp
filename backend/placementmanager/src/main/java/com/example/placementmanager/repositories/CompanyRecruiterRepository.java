package com.example.placementmanager.repositories;

import java.util.List;

import com.example.placementmanager.classes.CompanyRecruiter;
import com.example.placementmanager.classes.RegistrationDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRecruiterRepository extends JpaRepository<CompanyRecruiter, Long>{
    List<CompanyRecruiter> findByRegDetails(RegistrationDetails regDet);

    
}
