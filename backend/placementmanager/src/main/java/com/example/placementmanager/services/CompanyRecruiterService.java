package com.example.placementmanager.services;

import java.util.List;
import java.util.Optional;

import com.example.placementmanager.classes.CompanyRecruiter;
import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.repositories.CompanyRecruiterRepository;

import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyRecruiterService {
    @NonNull
    private final CompanyRecruiterRepository compRecruiterRepo;

    public Optional<CompanyRecruiter> getRecruiterById(Long recruiterId){
        return compRecruiterRepo.findById(recruiterId);
    }

    public List<CompanyRecruiter> getRecruiterByReg(RegistrationDetails reg){
        return compRecruiterRepo.findByRegDetails(reg);
    }

    public void saveRecruiter(CompanyRecruiter recruiter){
        compRecruiterRepo.saveAndFlush(recruiter);
    }

    public void deleteRecruiterById(Long recruiterId){
        compRecruiterRepo.deleteById(recruiterId);
    }
}
