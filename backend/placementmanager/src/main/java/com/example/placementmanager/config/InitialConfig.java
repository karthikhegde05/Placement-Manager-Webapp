package com.example.placementmanager.config;

import java.util.List;

import com.example.placementmanager.classes.Admin;
import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.repositories.AdminRespository;
import com.example.placementmanager.repositories.CompanyDriveRepository;
import com.example.placementmanager.repositories.CompanyRecruiterRepository;
import com.example.placementmanager.repositories.RegistrationDetailsRepository;
import com.example.placementmanager.repositories.StudentRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class InitialConfig {
    
    @Bean
    CommandLineRunner commandLineRunner(AdminRespository adminRepo, RegistrationDetailsRepository regRepo, 
        StudentRepository studRepo, CompanyDriveRepository compRepo, CompanyRecruiterRepository recruiterRepo){
            return args->{
                Admin admin1 = new Admin("Karthik", "Hegde", "IMT2018509", "IMT2018", "0809");
                Admin admin2 = new Admin("Jishnu", "Kumar", "IMT2018033", "IMT2018", "0810");

                RegistrationDetails regAdmin1 = new RegistrationDetails("kar123", "kar@gmail.com", "pass1", "admin");
                RegistrationDetails regAdmin2 = new RegistrationDetails("jis123", "jis@gmail.com", "pass2", "admin");

                admin1.setRegDetails(regAdmin1);
                admin2.setRegDetails(regAdmin2);

                regRepo.saveAllAndFlush(List.of(regAdmin1, regAdmin2));
                adminRepo.saveAllAndFlush(List.of(admin1, admin2));
            };
        }


    public static void main(String[] args){

    }
}
