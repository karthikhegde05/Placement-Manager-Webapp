package com.example.placementmanager.classes;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter @NoArgsConstructor
public class Student {
    @SequenceGenerator(
        name = "student_sequence",
        sequenceName = "student_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "student_sequence"
    )
    @Id
    private Long studentId;
    
    private String firstName;
    private String lastName;
    private String rollNumber;
    private String batch;
    private String contactNumber;
    private Double cgpa;
    // private String softwareResume;
    // private String datascienceResume;
    // private String eceResume;

    @Lob
    private byte[] softwareResume;
    @Lob
    private byte[] datascienceResume;
    @Lob
    private byte[] eceResume;

    @OneToOne(targetEntity = RegistrationDetails.class)
    @JoinColumn(name="user_id")
    private RegistrationDetails regDetails;

    @JsonIgnore
    @ManyToMany(mappedBy = "selectedStudents")
    List<CompanyDrive> lstCompanyDrives;

    public Student(String  firstName, String lastName, String rollNumber, String batch,
        String contactNumber){
            this.firstName = firstName;
            this.lastName = lastName;
            this.rollNumber = rollNumber;
            this.batch = batch;
            this.contactNumber = contactNumber;
        }

    public void addLstCompanyDrives(CompanyDrive cp){
        if(this.lstCompanyDrives == null)
            this.lstCompanyDrives = new ArrayList<CompanyDrive>();
        this.lstCompanyDrives.add(cp);
    }

}
