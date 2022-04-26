package com.example.placementmanager.services;

import java.util.List;
import java.util.Optional;

import com.example.placementmanager.classes.Admin;
import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.repositories.AdminRespository;

import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    @NonNull
    private final AdminRespository adminRepo;

    public Optional<Admin> getAdminById(Long adminId){
        return adminRepo.findById(adminId);
    }

    public List<Admin> getAdminByReg(RegistrationDetails reg){
        return adminRepo.findByRegDetails(reg);
    }

    public void saveAdmin(Admin admin){
        adminRepo.saveAndFlush(admin);
    }

    public void deleteAdminById(Long adminId){
        adminRepo.deleteById(adminId);
    }
}
