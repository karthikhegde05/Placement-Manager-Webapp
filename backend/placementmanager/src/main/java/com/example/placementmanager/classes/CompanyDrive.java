package com.example.placementmanager.classes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter @Getter @NoArgsConstructor
public class CompanyDrive {
    @SequenceGenerator(
        name = "company_drive_sequence",
        sequenceName =  "company_drive_sequence",
        allocationSize =  1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "company_drive_sequence"
    )
    @Id
    private Long companyId;
    
    private String name;
    private String stream;
    private String info;
    private String meetingLink;
    private String testLink;
    private String jobDescription;
    private String jobPay;
    private LocalDate deadlineDate;

    @ManyToMany
    @JoinTable(
        name="company_student",
        joinColumns = @JoinColumn(name = "company_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> selectedStudents;

    @ManyToMany
    @JoinTable(
        name="drive_recruiter",
        joinColumns = @JoinColumn(name = "company_id"),
        inverseJoinColumns = @JoinColumn(name = "recruiter_id")
    )
    private List<CompanyRecruiter> lstRecruiters;


    public CompanyDrive(String name, String stream, LocalDate deadlineDate){
        this.name = name;
        this.stream = stream;
        this.deadlineDate = deadlineDate;
    }

    public void addRecruiter(CompanyRecruiter cr){
        if(this.lstRecruiters==null)
            this.lstRecruiters = new ArrayList<CompanyRecruiter>();
        lstRecruiters.add(cr);
    }
}
