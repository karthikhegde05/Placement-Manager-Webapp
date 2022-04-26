package com.example.placementmanager.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.example.placementmanager.classes.CompanyDrive;
import com.example.placementmanager.repositories.CompanyDriveRepository;

import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyDriveService {
    @NonNull
    private final CompanyDriveRepository compDriveRepo;

    public List<CompanyDrive> getAllComp(){
        return compDriveRepo.findAll();
    }

    public List<CompanyDrive> getGreaterDate(LocalDate dt){
        return compDriveRepo.findByDeadlineDateGreaterThan(dt);
    }
    
    public Optional<CompanyDrive> getCompById(Long companyId){
        return compDriveRepo.findById(companyId);
    }

    public List<CompanyDrive> getByNameAndStream(String name, String stream){
        return compDriveRepo.findByNameAndStream(name, stream);
    }

    public void saveCompany(CompanyDrive comp){
        compDriveRepo.saveAndFlush(comp);
    }

    @Transactional
    public void updateCompDetails(Long companyId, String meetingLink, String testLink, String info, String jobDesc, String jobPay){
        compDriveRepo.updateDetails(companyId, meetingLink, testLink, info, jobDesc, jobPay);
    }


    public void deleteCompById(Long companyId){
        compDriveRepo.deleteById(companyId);
    }

    @Transactional
    public void deleteStudinCompany(Long companyId, Long studentId){
        compDriveRepo.deleteStudent(companyId, studentId);
    }

}
