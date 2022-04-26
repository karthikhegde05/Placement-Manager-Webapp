package com.example.placementmanager.classes;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter @NoArgsConstructor
public class CompanyRecruiter {
    @SequenceGenerator(
        name = "company_recruiter_sequence",
        sequenceName = "company_recruiter_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "company_recruiter_sequence"
    )
    @Id
    private Long recruiterId;
    private String firstName;
    private String lastName;
    private String contactNumber;
    
    @JsonIgnore
    @ManyToMany(mappedBy = "lstRecruiters", fetch = FetchType.LAZY)
    private List<CompanyDrive> lstCompanies; // most of the time it is one-to-one but just in case
    
    @OneToOne(targetEntity = RegistrationDetails.class)
    @JoinColumn(name="user_id")
    private RegistrationDetails regDetails;


    public CompanyRecruiter(String firstName, String lastName, String contactNumber){
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNumber = contactNumber;
    }

    public void addCompany(CompanyDrive cp){
        if(this.lstCompanies==null)
            this.lstCompanies = new ArrayList<CompanyDrive>();
        this.lstCompanies.add(cp);
    }
}
