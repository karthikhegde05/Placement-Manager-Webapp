package com.example.placementmanager.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import com.example.placementmanager.classes.RegistrationDetails;
import com.example.placementmanager.classes.Student;
import com.example.placementmanager.repositories.StudentRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
    @NonNull
    private final StudentRepository studRepo;

    public Optional<Student> getStudentById(Long studentId){
        return studRepo.findById(studentId);
    }

    public List<Student> getStudentByReg(RegistrationDetails reg){
        return studRepo.findByRegDetails(reg);
    }

    public void saveStudent(Student student){
        studRepo.saveAndFlush(student);
    }

    @Transactional
    public void updateStudentByCompany(Long studentId, Long companyId){
        studRepo.updateStudentByCompanyId(studentId, companyId);
    }

    @Transactional
    public void updateStudentProfile(Long studentId, String firstName, String lastName, byte[] softwareResume) throws IOException{
        studRepo.updateStudentProfile(studentId, firstName, lastName, softwareResume);
    }

    public void deleteStudentById(Long studentId){
        studRepo.deleteById(studentId);
    }
}
