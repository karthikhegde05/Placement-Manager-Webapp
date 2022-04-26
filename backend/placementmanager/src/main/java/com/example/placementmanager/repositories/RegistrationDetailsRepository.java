package com.example.placementmanager.repositories;

import com.example.placementmanager.classes.RegistrationDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistrationDetailsRepository extends JpaRepository<RegistrationDetails, String>{
    
}
