package com.example.placementmanager.repositories;

import java.util.List;

import com.example.placementmanager.classes.Admin;
import com.example.placementmanager.classes.RegistrationDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRespository extends JpaRepository<Admin, Long>{
    List<Admin> findByRegDetails(RegistrationDetails regDet);
}
