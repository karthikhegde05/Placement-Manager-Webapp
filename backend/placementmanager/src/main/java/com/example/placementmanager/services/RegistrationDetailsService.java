package com.example.placementmanager.services;

import java.util.Optional;

import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.repositories.RegistrationDetailsRepository;

import org.springframework.stereotype.Service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegistrationDetailsService {
    @NonNull
    private final RegistrationDetailsRepository regRepo;

    public Optional<RegistrationDetails> getRegById(String userId){
        return regRepo.findById(userId);
    }

    public void saveRegDetails(RegistrationDetails reg){
        regRepo.saveAndFlush(reg);
    }

    public void deleteRegById(String userId){
        regRepo.deleteById(userId);
    }
}
